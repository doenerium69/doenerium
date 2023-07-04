#ifndef BUILDING_NODE_EXTENSION
#define BUILDING_NODE_EXTENSION
#endif

#ifndef LIBLZMA_NODE_HPP
#define LIBLZMA_NODE_HPP

#include <napi.h>

#include <lzma.h>
#include "index-parser.h"

#include <vector>
#include <list>
#include <set>
#include <queue>
#include <string>
#include <utility>
#include <atomic>
#include <mutex>
#include <memory>

namespace lzma {
  using namespace Napi;

  /* util */
  /**
   * Return the filter constant associated with a v8 String handle
   */
  lzma_vli FilterByName(Value name);

  /**
   * If rv represents an error, throw a javascript exception representing it.
   * Always returns rv as a v8 Integer.
   */
  Number lzmaRet(Env env, lzma_ret rv);

  /**
   * Return a javascript exception representing rv.
   */
  Error lzmaRetError(Env env, lzma_ret rv);

  /**
   * Takes a Node.js SlowBuffer or Buffer as input and populates data accordingly.
   * Returns true on success, false on failure.
   */
  bool readBufferFromObj(Value value, std::vector<uint8_t>* data);

  /**
   * Return a lzma_options_lzma struct as described by the v8 Object obj.
   */
  lzma_options_lzma parseOptionsLZMA(Value obj);

  /**
   * Return a v8 Number representation of an uint64_t where UINT64_MAX will be mapped to null
   */
  Value Uint64ToNumberMaxNull(Env env, uint64_t in);

  /**
   * Return a v8 Number representation of an uint64_t where 0 will be mapped to null
   */
  Value Uint64ToNumber0Null(Env env, uint64_t in);

  /**
   * Return a uint64_t representation of a v8 Number,
   * where values above UINT64_MAX map to UINT64_MAX and null to UINT64_MAX.
   * Throws an TypeError if the input is not a number.
   */
  uint64_t NumberToUint64ClampNullMax(Value in);

  /**
   * Return an integer property of an object (which can be passed to Nan::Get),
   * providing a default value if no such property is present
   */
  inline int64_t GetIntegerProperty(Object obj, const char* name, int64_t def) {
    Value v = obj[name];

    if (v.IsUndefined())
      return def;

    return v.ToNumber().Int64Value();
  }

  /* bindings in one-to-one correspondence to the lzma functions */
  Value lzmaVersionNumber(const CallbackInfo& info);
  Value lzmaVersionString(const CallbackInfo& info);
  Value lzmaCheckIsSupported(const CallbackInfo& info);
  Value lzmaCheckSize(const CallbackInfo& info);
  Value lzmaFilterEncoderIsSupported(const CallbackInfo& info);
  Value lzmaFilterDecoderIsSupported(const CallbackInfo& info);
  Value lzmaMfIsSupported(const CallbackInfo& info);
  Value lzmaModeIsSupported(const CallbackInfo& info);
  Value lzmaEasyEncoderMemusage(const CallbackInfo& info);
  Value lzmaEasyDecoderMemusage(const CallbackInfo& info);
  Value lzmaCRC32(const CallbackInfo& info);
  Value lzmaRawEncoderMemusage(const CallbackInfo& info);
  Value lzmaRawDecoderMemusage(const CallbackInfo& info);

  /* wrappers */
  /**
   * List of liblzma filters with corresponding options
   */
  class FilterArray {
    public:
      FilterArray() = default;
      explicit FilterArray(Value arr);

      lzma_filter* array() { return filters.data(); }
      const lzma_filter* array() const { return filters.data(); }

    private:
      FilterArray(const FilterArray&);
      FilterArray& operator=(const FilterArray&);

      union options {
        lzma_options_delta delta;
        lzma_options_lzma lzma;
      };

      std::vector<lzma_filter> filters;
      std::list<options> optbuf;
  };

  /**
   * Wrapper for lzma_mt (multi-threading options).
   */
  class MTOptions {
    public:
      MTOptions() = default;
      explicit MTOptions(Value val);

      lzma_mt* opts() { return &opts_; }
      const lzma_mt* opts() const { return &opts_; }

    private:
      std::unique_ptr<FilterArray> filters_;
      lzma_mt opts_;
  };

  /**
   * Node.js object wrap for lzma_stream wrapper. Corresponds to exports.Stream
   */
  class LZMAStream : public ObjectWrap<LZMAStream> {
    public:
      explicit LZMAStream(const CallbackInfo& info);
      ~LZMAStream();
      static void InitializeExports(Object exports);

    /* regard as private: */
      void doLZMACodeFromAsync();
      void invokeBufferHandlers(bool hasLock);
      void* alloc(size_t nmemb, size_t size);
      void free(void* ptr);

    private:
      void resetUnderlying();
      void doLZMACode();

      static Napi::Value New(const CallbackInfo& info);

      void adjustExternalMemory(int64_t bytesChange);
      void reportAdjustedExternalMemoryToV8();

      struct MemScope {
        explicit MemScope(LZMAStream* stream) : stream(stream) { }
        ~MemScope() { stream->reportAdjustedExternalMemoryToV8(); }
        LZMAStream* stream;
      };

      AsyncContext async_context;
      std::atomic<int64_t> nonAdjustedExternalMemory;
      std::mutex mutex;

      void ResetUnderlying(const CallbackInfo& info);
      Napi::Value SetBufsize(const CallbackInfo& info);
      void Code(const CallbackInfo& info);
      Napi::Value Memusage(const CallbackInfo& info);
      Napi::Value MemlimitGet(const CallbackInfo& info);
      Napi::Value MemlimitSet(const CallbackInfo& info);
      Napi::Value RawEncoder(const CallbackInfo& info);
      Napi::Value RawDecoder(const CallbackInfo& info);
      Napi::Value FiltersUpdate(const CallbackInfo& info);
      Napi::Value EasyEncoder(const CallbackInfo& info);
      Napi::Value StreamEncoder(const CallbackInfo& info);
      Napi::Value AloneEncoder(const CallbackInfo& info);
      Napi::Value MTEncoder(const CallbackInfo& info);
      Napi::Value StreamDecoder(const CallbackInfo& info);
      Napi::Value AutoDecoder(const CallbackInfo& info);
      Napi::Value AloneDecoder(const CallbackInfo& info);

      lzma_allocator allocator;
      lzma_stream _;
      size_t bufsize;
      std::string error;

      bool shouldFinish;
      size_t processedChunks;
      lzma_ret lastCodeResult;
      std::queue<std::vector<uint8_t>> inbufs;
      std::queue<std::vector<uint8_t>> outbufs;
  };

  /**
   * Async worker for a single coding step.
   */
  class LZMAStreamCodingWorker : public AsyncWorker {
    public:
      LZMAStreamCodingWorker(LZMAStream* stream_)
        : AsyncWorker(Function(stream_->Env(), nullptr), "LZMAStreamCodingWorker"),
          stream(stream_) {
        Receiver().Set(static_cast<uint32_t>(0), stream->Value());
      }

      ~LZMAStreamCodingWorker() {}

      void Execute() override {
        stream->doLZMACodeFromAsync();
      }

    private:
      void OnOK() {
        stream->invokeBufferHandlers(false);
      }

      void OnOK(const Error& e) {
        stream->invokeBufferHandlers(false);
      }

      LZMAStream* stream;
  };

  class IndexParser : public ObjectWrap<IndexParser> {
    public:
      explicit IndexParser(const CallbackInfo& info);
      ~IndexParser();

      static void InitializeExports(Object exports);

    /* regard as private: */
      int64_t readCallback(void* opaque, uint8_t* buf, size_t count, int64_t offset);

    private:
      lzma_index_parser_data info;
      lzma_allocator allocator;

      uint8_t* currentReadBuffer;
      size_t currentReadSize;
      bool isCurrentlyInParseCall;

      Object getObject() const;

      void Init(const CallbackInfo& info);
      Napi::Value Feed(const CallbackInfo& info);
      Napi::Value Parse(const CallbackInfo& info);
  };
}

#endif
