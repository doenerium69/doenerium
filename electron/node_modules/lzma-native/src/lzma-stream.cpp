#include "liblzma-node.hpp"
#include <cstring>
#include <cstdlib>
#include <cassert>
#include <climits>

namespace lzma {

namespace {
  extern "C" void* LZMA_API_CALL
  alloc_for_lzma(void *opaque, size_t nmemb, size_t size) {
    LZMAStream* strm = static_cast<LZMAStream*>(opaque);

    return strm->alloc(nmemb, size);
  }

  extern "C" void LZMA_API_CALL
  free_for_lzma(void *opaque, void *ptr) {
    LZMAStream* strm = static_cast<LZMAStream*>(opaque);

    return strm->free(ptr);
  }
}

LZMAStream::LZMAStream(const CallbackInfo& info) :
  ObjectWrap(info),
  async_context(info.Env(), "LZMAStream"),
  bufsize(65536),
  shouldFinish(false),
  processedChunks(0),
  lastCodeResult(LZMA_OK)
{
  std::memset(&_, 0, sizeof(lzma_stream));

  allocator.alloc = alloc_for_lzma;
  allocator.free = free_for_lzma;
  allocator.opaque = static_cast<void*>(this);
  _.allocator = &allocator;

  nonAdjustedExternalMemory = 0;
  MemoryManagement::AdjustExternalMemory(info.Env(), sizeof(LZMAStream));
}

void LZMAStream::resetUnderlying() {
  if (_.internal != nullptr)
    lzma_end(&_);

  reportAdjustedExternalMemoryToV8();
  std::memset(&_, 0, sizeof(lzma_stream));
  _.allocator = &allocator;
  lastCodeResult = LZMA_OK;
  processedChunks = 0;
}

LZMAStream::~LZMAStream() {
  resetUnderlying();

  MemoryManagement::AdjustExternalMemory(Env(), -int64_t(sizeof(LZMAStream)));
}

void* LZMAStream::alloc(size_t nmemb, size_t size) {
  size_t nBytes = nmemb * size + sizeof(size_t);

  size_t* result = static_cast<size_t*>(::malloc(nBytes));
  if (!result)
    return result;

  *result = nBytes;
  adjustExternalMemory(static_cast<int64_t>(nBytes));
  return static_cast<void*>(result + 1);
}

void LZMAStream::free(void* ptr) {
  if (!ptr)
    return;

  size_t* orig = static_cast<size_t*>(ptr) - 1;

  adjustExternalMemory(-static_cast<int64_t>(*orig));
  return ::free(static_cast<void*>(orig));
}

void LZMAStream::reportAdjustedExternalMemoryToV8() {
  int64_t to_be_reported = nonAdjustedExternalMemory.exchange(0);
  if (to_be_reported == 0)
    return;

  MemoryManagement::AdjustExternalMemory(Env(), nonAdjustedExternalMemory);
}

void LZMAStream::adjustExternalMemory(int64_t bytesChange) {
  nonAdjustedExternalMemory += bytesChange;
}

void LZMAStream::ResetUnderlying(const CallbackInfo& info) {
  MemScope mem_scope(this);
  std::lock_guard<std::mutex> lock(mutex);

  resetUnderlying();
}

Value LZMAStream::SetBufsize(const CallbackInfo& info) {
  size_t oldBufsize, newBufsize = NumberToUint64ClampNullMax(info[0]);

  {
    std::lock_guard<std::mutex> lock(mutex);

    oldBufsize = bufsize;

    if (newBufsize && newBufsize != UINT_MAX)
      bufsize = newBufsize;
  }

  return Number::New(Env(), oldBufsize);
}

void LZMAStream::Code(const CallbackInfo& info) {
  MemScope mem_scope(this);
  std::lock_guard<std::mutex> lock(mutex);

  std::vector<uint8_t> inputData;

  if (info[0].IsUndefined() || info[0].IsNull()) {
    shouldFinish = true;
  } else {
    if (!readBufferFromObj(info[0], &inputData))
      return;

    if (inputData.empty())
      shouldFinish = true;
  }
  inbufs.push(std::move(inputData));

  bool async = info[1].ToBoolean();

  if (async) {
    (new LZMAStreamCodingWorker(this))->Queue();
  } else {
    doLZMACode();
    invokeBufferHandlers(true);
  }
}

template <typename T>
struct Maybe {

};

void LZMAStream::invokeBufferHandlers(bool hasLock) {
  Napi::Env env = Env();
  HandleScope scope(env);
  MemScope mem_scope(this);

  std::unique_lock<std::mutex> lock;
  if (!hasLock)
    lock = std::unique_lock<std::mutex>(mutex);

  Function bufferHandler = Napi::Value(Value()["bufferHandler"]).As<Function>();
  std::vector<uint8_t> outbuf;

  auto CallBufferHandlerWithArgv = [&](size_t argc, const napi_value* argv) {
    if (!hasLock) lock.unlock();
    bufferHandler.MakeCallback(Value(), 5, argv, async_context);
    if (!hasLock) lock.lock();
  };

  uint64_t in = UINT64_MAX, out = UINT64_MAX;
  if (_.internal)
    lzma_get_progress(&_, &in, &out);
  Napi::Value in_   = Uint64ToNumberMaxNull(env, in);
  Napi::Value out_  = Uint64ToNumberMaxNull(env, out);

  while (outbufs.size() > 0) {
    outbuf = std::move(outbufs.front());
    outbufs.pop();

    napi_value argv[5] = {
      Buffer<char>::Copy(env, reinterpret_cast<const char*>(outbuf.data()), outbuf.size()),
      env.Undefined(), env.Undefined(), in_, out_
    };
    CallBufferHandlerWithArgv(5, argv);
  }

  bool reset = false;
  if (lastCodeResult != LZMA_OK) {
    Napi::Value errorArg = env.Null();

    if (lastCodeResult != LZMA_STREAM_END)
      errorArg = lzmaRetError(env, lastCodeResult).Value();

    reset = true;

    napi_value argv[5] = { env.Null(), env.Undefined(), errorArg, in_, out_ };
    CallBufferHandlerWithArgv(5, argv);
  }

  if (processedChunks) {
    size_t pc = processedChunks;
    processedChunks = 0;

    napi_value argv[5] = {
      env.Undefined(), Number::New(env, static_cast<uint32_t>(pc)),
      env.Undefined(), in_, out_
    };
    CallBufferHandlerWithArgv(5, argv);
  }

  if (reset)
    resetUnderlying(); // resets lastCodeResult!
}

void LZMAStream::doLZMACodeFromAsync() {
  std::lock_guard<std::mutex> lock(mutex);

  doLZMACode();
}

void LZMAStream::doLZMACode() {
  std::vector<uint8_t> outbuf(bufsize), inbuf;
  _.next_out = outbuf.data();
  _.avail_out = outbuf.size();
  _.avail_in = 0;

  lzma_action action = LZMA_RUN;

  size_t readChunks = 0;

  // _.internal is set to nullptr when lzma_end() is called via resetUnderlying()
  while (_.internal) {
    if (_.avail_in == 0) { // more input neccessary?
      while (_.avail_in == 0 && !inbufs.empty()) {
        inbuf = std::move(inbufs.front());
        inbufs.pop();
        readChunks++;

        _.next_in = inbuf.data();
        _.avail_in = inbuf.size();
      }
    }

    if (shouldFinish && inbufs.empty())
      action = LZMA_FINISH;

    _.next_out = outbuf.data();
    _.avail_out = outbuf.size();

    lastCodeResult = lzma_code(&_, action);

    if (lastCodeResult != LZMA_OK && lastCodeResult != LZMA_STREAM_END) {
      processedChunks += readChunks;
      readChunks = 0;

      break;
    }

    if (_.avail_out == 0 || _.avail_in == 0 || lastCodeResult == LZMA_STREAM_END) {
      size_t outsz = outbuf.size() - _.avail_out;

      if (outsz > 0) {
#ifndef LZMA_NO_CXX11_RVALUE_REFERENCES // C++11
        outbufs.emplace(outbuf.data(), outbuf.data() + outsz);
#else
        outbufs.push(std::vector<uint8_t>(outbuf.data(), outbuf.data() + outsz));
#endif
      }

      if (lastCodeResult == LZMA_STREAM_END) {
        processedChunks += readChunks;
        readChunks = 0;

        break;
      }
    }

    if (_.avail_out == outbuf.size()) { // no progress was made
      if (!shouldFinish) {
        processedChunks += readChunks;
        readChunks = 0;
      }


      if (!shouldFinish)
        break;
    }
  }
}

void LZMAStream::InitializeExports(Object exports) {
  exports["Stream"] = DefineClass(exports.Env(), "LZMAStream", {
    InstanceMethod("setBufsize", &LZMAStream::SetBufsize),
    InstanceMethod("resetUnderlying", &LZMAStream::ResetUnderlying),
    InstanceMethod("code", &LZMAStream::Code),
    InstanceMethod("memusage", &LZMAStream::Memusage),
    InstanceMethod("memlimitGet", &LZMAStream::MemlimitGet),
    InstanceMethod("memlimitSet", &LZMAStream::MemlimitSet),
    InstanceMethod("rawEncoder_", &LZMAStream::RawEncoder),
    InstanceMethod("rawDecoder_", &LZMAStream::RawDecoder),
    InstanceMethod("filtersUpdate", &LZMAStream::FiltersUpdate),
    InstanceMethod("easyEncoder_", &LZMAStream::EasyEncoder),
    InstanceMethod("streamEncoder_", &LZMAStream::StreamEncoder),
    InstanceMethod("aloneEncoder", &LZMAStream::AloneEncoder),
    InstanceMethod("mtEncoder_", &LZMAStream::MTEncoder),
    InstanceMethod("streamDecoder_", &LZMAStream::StreamDecoder),
    InstanceMethod("autoDecoder_", &LZMAStream::AutoDecoder),
    InstanceMethod("aloneDecoder_", &LZMAStream::AloneDecoder),
  });
}

Value LZMAStream::Memusage(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  return Uint64ToNumber0Null(Env(), lzma_memusage(&_));
}

Value LZMAStream::MemlimitGet(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  return Uint64ToNumber0Null(Env(), lzma_memlimit_get(&_));
}

Value LZMAStream::MemlimitSet(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  if (!info[0].IsNumber())
    throw TypeError::New(Env(), "memlimitSet() needs a numerical argument");

  Number arg = info[0].As<Number>();

  return lzmaRet(Env(), lzma_memlimit_set(&_, NumberToUint64ClampNullMax(arg)));
}

Value LZMAStream::RawEncoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  const FilterArray filters(info[0]);

  return lzmaRet(Env(), lzma_raw_encoder(&_, filters.array()));
}

Value LZMAStream::RawDecoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  const FilterArray filters(info[0]);

  return lzmaRet(Env(), lzma_raw_decoder(&_, filters.array()));
}

Value LZMAStream::FiltersUpdate(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  const FilterArray filters(info[0]);

  return lzmaRet(Env(), lzma_filters_update(&_, filters.array()));
}

Value LZMAStream::EasyEncoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  int64_t preset = info[0].ToNumber().Int64Value();
  int64_t check = info[1].ToNumber().Int64Value();

  return lzmaRet(Env(), lzma_easy_encoder(&_, preset, (lzma_check) check));
}

Value LZMAStream::StreamEncoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  const FilterArray filters(info[0]);
  int64_t check = info[1].ToNumber().Int64Value();

  return lzmaRet(Env(), lzma_stream_encoder(&_, filters.array(), (lzma_check) check));
}

Value LZMAStream::MTEncoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  const MTOptions mt(info[0]);

  return lzmaRet(Env(), lzma_stream_encoder_mt(&_, mt.opts()));
}

Value LZMAStream::AloneEncoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  lzma_options_lzma o = parseOptionsLZMA(info[0]);

  return lzmaRet(Env(), lzma_alone_encoder(&_, &o));
}

Value LZMAStream::StreamDecoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  uint64_t memlimit = NumberToUint64ClampNullMax(info[0]);
  int64_t flags = info[1].ToNumber().Int64Value();

  return lzmaRet(Env(), lzma_stream_decoder(&_, memlimit, flags));
}

Value LZMAStream::AutoDecoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  uint64_t memlimit = NumberToUint64ClampNullMax(info[0]);
  int64_t flags = info[1].ToNumber().Int64Value();

  return lzmaRet(Env(), lzma_auto_decoder(&_, memlimit, flags));
}

Value LZMAStream::AloneDecoder(const CallbackInfo& info) {
  std::lock_guard<std::mutex> lock(mutex);

  uint64_t memlimit = NumberToUint64ClampNullMax(info[0]);

  return lzmaRet(Env(), lzma_alone_decoder(&_, memlimit));
}

}
