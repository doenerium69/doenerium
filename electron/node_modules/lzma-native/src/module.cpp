#include "liblzma-node.hpp"

using namespace lzma;

static Napi::Object moduleInit(Env env, Object exports) {
  LZMAStream::InitializeExports(exports);
  IndexParser::InitializeExports(exports);

  exports["versionNumber"] = Function::New(env, lzmaVersionNumber);
  exports["versionString"] = Function::New(env, lzmaVersionString);
  exports["checkIsSupported"] = Function::New(env, lzmaCheckIsSupported);
  exports["checkSize"] = Function::New(env, lzmaCheckSize);
  exports["crc32_"] = Function::New(env, lzmaCRC32);
  exports["filterEncoderIsSupported"] = Function::New(env, lzmaFilterEncoderIsSupported);
  exports["filterDecoderIsSupported"] = Function::New(env, lzmaFilterDecoderIsSupported);
  exports["rawEncoderMemusage"] = Function::New(env, lzmaRawEncoderMemusage);
  exports["rawDecoderMemusage"] = Function::New(env, lzmaRawDecoderMemusage);
  exports["mfIsSupported"] = Function::New(env, lzmaMfIsSupported);
  exports["modeIsSupported"] = Function::New(env, lzmaModeIsSupported);
  exports["easyEncoderMemusage"] = Function::New(env, lzmaEasyEncoderMemusage);
  exports["easyDecoderMemusage"] = Function::New(env, lzmaEasyDecoderMemusage);

  // enum lzma_ret
  exports["OK"] = Number::New(env, LZMA_OK);
  exports["STREAM_END"] = Number::New(env, LZMA_STREAM_END);
  exports["NO_CHECK"] = Number::New(env, LZMA_NO_CHECK);
  exports["UNSUPPORTED_CHECK"] = Number::New(env, LZMA_UNSUPPORTED_CHECK);
  exports["GET_CHECK"] = Number::New(env, LZMA_GET_CHECK);
  exports["MEM_ERROR"] = Number::New(env, LZMA_MEM_ERROR);
  exports["MEMLIMIT_ERROR"] = Number::New(env, LZMA_MEMLIMIT_ERROR);
  exports["FORMAT_ERROR"] = Number::New(env, LZMA_FORMAT_ERROR);
  exports["OPTIONS_ERROR"] = Number::New(env, LZMA_OPTIONS_ERROR);
  exports["DATA_ERROR"] = Number::New(env, LZMA_DATA_ERROR);
  exports["BUF_ERROR"] = Number::New(env, LZMA_BUF_ERROR);
  exports["PROG_ERROR"] = Number::New(env, LZMA_PROG_ERROR);

  // enum lzma_action
  exports["RUN"] = Number::New(env, LZMA_RUN);
  exports["SYNC_FLUSH"] = Number::New(env, LZMA_SYNC_FLUSH);
  exports["FULL_FLUSH"] = Number::New(env, LZMA_FULL_FLUSH);
  exports["FINISH"] = Number::New(env, LZMA_FINISH);

  // enum lzma_check
  exports["CHECK_NONE"] = Number::New(env, LZMA_CHECK_NONE);
  exports["CHECK_CRC32"] = Number::New(env, LZMA_CHECK_CRC32);
  exports["CHECK_CRC64"] = Number::New(env, LZMA_CHECK_CRC64);
  exports["CHECK_SHA256"] = Number::New(env, LZMA_CHECK_SHA256);

  // lzma_match_finder
  exports["MF_HC3"] = Number::New(env, LZMA_MF_HC3);
  exports["MF_HC4"] = Number::New(env, LZMA_MF_HC4);
  exports["MF_BT2"] = Number::New(env, LZMA_MF_BT2);
  exports["MF_BT3"] = Number::New(env, LZMA_MF_BT3);
  exports["MF_BT4"] = Number::New(env, LZMA_MF_BT4);

  // lzma_mode
  exports["MODE_FAST"] = Number::New(env, LZMA_MODE_FAST);
  exports["MODE_NORMAL"] = Number::New(env, LZMA_MODE_NORMAL);

  // defines
  exports["FILTER_X86"] = String::New(env, "LZMA_FILTER_X86");
  exports["FILTER_POWERPC"] = String::New(env, "LZMA_FILTER_POWERPC");
  exports["FILTER_IA64"] = String::New(env, "LZMA_FILTER_IA64");
  exports["FILTER_ARM"] = String::New(env, "LZMA_FILTER_ARM");
  exports["FILTER_ARMTHUMB"] = String::New(env, "LZMA_FILTER_ARMTHUMB");
  exports["FILTER_SPARC"] = String::New(env, "LZMA_FILTER_SPARC");
  exports["FILTER_DELTA"] = String::New(env, "LZMA_FILTER_DELTA");
  exports["FILTERS_MAX"] = String::New(env, "LZMA_FILTERS_MAX");
  exports["FILTER_LZMA1"] = String::New(env, "LZMA_FILTER_LZMA1");
  exports["FILTER_LZMA2"] = String::New(env, "LZMA_FILTER_LZMA2");
  exports["VLI_UNKNOWN"] = String::New(env, "LZMA_VLI_UNKNOWN");

  exports["VLI_BYTES_MAX"] = Number::New(env, LZMA_VLI_BYTES_MAX);
  exports["CHECK_ID_MAX"] = Number::New(env, LZMA_CHECK_ID_MAX);
  exports["CHECK_SIZE_MAX"] = Number::New(env, LZMA_CHECK_SIZE_MAX);
  exports["PRESET_DEFAULT"] = Number::New(env, LZMA_PRESET_DEFAULT);
  exports["PRESET_LEVEL_MASK"] = Number::New(env, LZMA_PRESET_LEVEL_MASK);
  exports["PRESET_EXTREME"] = Number::New(env, LZMA_PRESET_EXTREME);
  exports["TELL_NO_CHECK"] = Number::New(env, LZMA_TELL_NO_CHECK);
  exports["TELL_UNSUPPORTED_CHECK"] = Number::New(env, LZMA_TELL_UNSUPPORTED_CHECK);
  exports["TELL_ANY_CHECK"] = Number::New(env, LZMA_TELL_ANY_CHECK);
  exports["CONCATENATED"] = Number::New(env, LZMA_CONCATENATED);
  exports["STREAM_HEADER_SIZE"] = Number::New(env, LZMA_STREAM_HEADER_SIZE);
  exports["VERSION_MAJOR"] = Number::New(env, LZMA_VERSION_MAJOR);
  exports["VERSION_MINOR"] = Number::New(env, LZMA_VERSION_MINOR);
  exports["VERSION_PATCH"] = Number::New(env, LZMA_VERSION_PATCH);
  exports["VERSION_STABILITY"] = Number::New(env, LZMA_VERSION_STABILITY);
  exports["VERSION_STABILITY_ALPHA"] = Number::New(env, LZMA_VERSION_STABILITY_ALPHA);
  exports["VERSION_STABILITY_BETA"] = Number::New(env, LZMA_VERSION_STABILITY_BETA);
  exports["VERSION_STABILITY_STABLE"] = Number::New(env, LZMA_VERSION_STABILITY_STABLE);
  exports["VERSION"] = Number::New(env, LZMA_VERSION);
  exports["VERSION_STRING"] = String::New(env, LZMA_VERSION_STRING);

  exports["asyncCodeAvailable"] = Boolean::New(env, true);
  return exports;
}

NODE_API_MODULE(lzma_native, moduleInit)

