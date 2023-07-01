#include "liblzma-node.hpp"

namespace lzma {

Value lzmaVersionNumber(const CallbackInfo& info) {
  return Number::New(info.Env(), lzma_version_number());
}

Value lzmaVersionString(const CallbackInfo& info) {
  return String::New(info.Env(), lzma_version_string());
}

Value lzmaCheckIsSupported(const CallbackInfo& info) {
  lzma_check arg = (lzma_check) info[0].ToNumber().Int64Value();

  return Boolean::New(info.Env(), lzma_check_is_supported(arg));
}

Value lzmaCheckSize(const CallbackInfo& info) {
  lzma_check arg = (lzma_check) info[0].ToNumber().Int64Value();

  return Number::New(info.Env(), lzma_check_size(arg));
}

Value lzmaFilterEncoderIsSupported(const CallbackInfo& info) {
  uint64_t arg = FilterByName(info[0]);

  return Boolean::New(info.Env(), lzma_filter_encoder_is_supported(arg));
}

Value lzmaFilterDecoderIsSupported(const CallbackInfo& info) {
  uint64_t arg = FilterByName(info[0]);

  return Boolean::New(info.Env(), lzma_filter_decoder_is_supported(arg));
}

Value lzmaMfIsSupported(const CallbackInfo& info) {
  lzma_match_finder arg = (lzma_match_finder) info[0].ToNumber().Int64Value();

  return Boolean::New(info.Env(), lzma_mf_is_supported(arg));
}

Value lzmaModeIsSupported(const CallbackInfo& info) {
  lzma_mode arg = (lzma_mode) info[0].ToNumber().Int64Value();

  return Boolean::New(info.Env(), lzma_mode_is_supported(arg));
}

Value lzmaEasyEncoderMemusage(const CallbackInfo& info) {
  int64_t arg = info[0].ToNumber();

  return Uint64ToNumberMaxNull(info.Env(), lzma_easy_encoder_memusage(arg));
}

Value lzmaEasyDecoderMemusage(const CallbackInfo& info) {
  int64_t arg = info[0].ToNumber();

  return Uint64ToNumberMaxNull(info.Env(), lzma_easy_decoder_memusage(arg));
}

Value lzmaCRC32(const CallbackInfo& info) {
  int64_t arg = info[1].ToNumber();

  std::vector<uint8_t> data;

  if (!readBufferFromObj(info[0], &data))
    throw TypeError::New(info.Env(), "CRC32 expects Buffer as input");

  return Number::New(info.Env(), lzma_crc32(data.data(), data.size(), arg));
}

Value lzmaRawEncoderMemusage(const CallbackInfo& info) {
  const FilterArray filters(info[0]);

  return Uint64ToNumberMaxNull(info.Env(), lzma_raw_encoder_memusage(filters.array()));
}

Value lzmaRawDecoderMemusage(const CallbackInfo& info) {
  const FilterArray filters(info[0]);

  return Uint64ToNumberMaxNull(info.Env(), lzma_raw_decoder_memusage(filters.array()));
}

}
