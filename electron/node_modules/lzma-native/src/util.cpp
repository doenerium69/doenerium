#include "liblzma-node.hpp"
#include <cstring>

namespace lzma {

lzma_vli FilterByName(Value name) {
  std::string cpp_string(name.ToString());

  struct SearchEntry {
    const char* str;
    lzma_vli value;
  };

  static const struct SearchEntry search[] = {
    { "LZMA_FILTER_X86", LZMA_FILTER_X86 },
    { "LZMA_FILTER_POWERPC", LZMA_FILTER_POWERPC },
    { "LZMA_FILTER_IA64", LZMA_FILTER_IA64 },
    { "LZMA_FILTER_ARM", LZMA_FILTER_ARM },
    { "LZMA_FILTER_ARMTHUMB", LZMA_FILTER_ARMTHUMB },
    { "LZMA_FILTER_SPARC", LZMA_FILTER_SPARC },
    { "LZMA_FILTER_DELTA", LZMA_FILTER_DELTA },
    { "LZMA_FILTER_LZMA1", LZMA_FILTER_LZMA1 },
    { "LZMA_FILTER_LZMA2", LZMA_FILTER_LZMA2 },
    { "LZMA_FILTERS_MAX", LZMA_FILTERS_MAX },
    { "LZMA_VLI_UNKNOWN", LZMA_VLI_UNKNOWN }
  };

  for (const struct SearchEntry* p = search; ; ++p)
    if (p->value == LZMA_VLI_UNKNOWN || cpp_string == p->str)
      return p->value;
}

Error lzmaRetError(Env env, lzma_ret rv) {
  struct ErrorInfo {
    lzma_ret code;
    const char* name;
    const char* desc;
  };

  /* description strings taken from liblzma/…/api/base.h */
  static const struct ErrorInfo searchErrorInfo[] = {
    { LZMA_OK,                "LZMA_OK", "Operation completed successfully" },
    { LZMA_STREAM_END,        "LZMA_STREAM_END", "End of stream was reached" },
    { LZMA_NO_CHECK,          "LZMA_NO_CHECK", "Input stream has no integrity check" },
    { LZMA_UNSUPPORTED_CHECK, "LZMA_UNSUPPORTED_CHECK", "Cannot calculate the integrity check" },
    { LZMA_GET_CHECK,         "LZMA_GET_CHECK", "Integrity check type is now available" },
    { LZMA_MEM_ERROR,         "LZMA_MEM_ERROR", "Cannot allocate memory" },
    { LZMA_MEMLIMIT_ERROR,    "LZMA_MEMLIMIT_ERROR", "Memory usage limit was reached" },
    { LZMA_FORMAT_ERROR,      "LZMA_FORMAT_ERROR", "File format not recognized" },
    { LZMA_OPTIONS_ERROR,     "LZMA_OPTIONS_ERROR", "Invalid or unsupported options" },
    { LZMA_DATA_ERROR,        "LZMA_DATA_ERROR", "Data is corrupt" },
    { LZMA_PROG_ERROR,        "LZMA_PROG_ERROR", "Programming error" },
    { LZMA_BUF_ERROR,         "LZMA_BUF_ERROR", "No progress is possible" },
    { (lzma_ret)-1,           "LZMA_UNKNOWN_ERROR", "Unknown error code" }
  };

  const struct ErrorInfo* p = searchErrorInfo;
  while (p->code != rv && p->code != (lzma_ret)-1)
    ++p;

  Error err = Error::New(env, p->desc);
  err.Set("code", Number::New(env, rv));
  err.Set("name", String::New(env, p->name));
  err.Set("desc", String::New(env, p->desc));

  return err;
}

Number lzmaRet(Env env, lzma_ret rv) {
  if (rv != LZMA_OK && rv != LZMA_STREAM_END)
    throw lzmaRetError(env, rv);

  return Number::New(env, rv);
}

bool readBufferFromObj(Value buf_, std::vector<uint8_t>* data) {
  if (!buf_.IsTypedArray()) {
    throw TypeError::New(buf_.Env(), "Expected Buffer as input");
    return false;
  }

  TypedArray buf = buf_.As<TypedArray>();
  size_t len = buf.ByteLength();
  const uint8_t* ptr = len > 0 ?
      static_cast<const uint8_t*>(buf.ArrayBuffer().Data()) + buf.ByteOffset() :
      reinterpret_cast<const uint8_t*>("");

  *data = std::vector<uint8_t>(ptr, ptr + len);

  return true;
}

lzma_options_lzma parseOptionsLZMA (Value val) {
  HandleScope scope(val.Env());
  Object obj = val.IsUndefined() || val.IsNull() ?
      Object::New(val.Env()) : val.ToObject();

  lzma_options_lzma r;
  r.dict_size = GetIntegerProperty(obj, "dictSize", LZMA_DICT_SIZE_DEFAULT);
  r.lp = GetIntegerProperty(obj, "lp", LZMA_LP_DEFAULT);
  r.lc = GetIntegerProperty(obj, "lc", LZMA_LC_DEFAULT);
  r.pb = GetIntegerProperty(obj, "pb", LZMA_PB_DEFAULT);
  r.mode = (lzma_mode)GetIntegerProperty(obj, "mode", (int64_t)LZMA_MODE_FAST);
  r.nice_len = GetIntegerProperty(obj, "niceLen", 64);
  r.mf = (lzma_match_finder)GetIntegerProperty(obj, "mf", (int64_t)LZMA_MF_HC4);
  r.depth = GetIntegerProperty(obj, "depth", 0);
  uint64_t preset_ = GetIntegerProperty(obj, "preset", UINT64_MAX);

  r.preset_dict = nullptr;

  if (preset_ != UINT64_MAX)
    lzma_lzma_preset(&r, preset_);

  return r;
}

Value Uint64ToNumberMaxNull(Env env, uint64_t in) {
  if (in == UINT64_MAX)
    return env.Null();
  else
    return Number::New(env, in);
}

Value Uint64ToNumber0Null(Env env, uint64_t in) {
  if (in == 0)
    return env.Null();
  else
    return Number::New(env, in);
}

uint64_t NumberToUint64ClampNullMax(Value in) {
  if (in.IsNull() || in.IsUndefined())
    return UINT64_MAX;

  Number n = in.ToNumber();

  return n.Int64Value();
}

}
