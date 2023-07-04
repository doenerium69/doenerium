#include "liblzma-node.hpp"

namespace lzma {

MTOptions::MTOptions(Value val) {
  Object opt = val.IsUndefined() || val.IsNull() ?
      Object::New(val.Env()) : val.ToObject();
  opts_.flags = 0;
  opts_.filters = nullptr;

  opts_.block_size = Value(opt["blockSize"]).ToNumber().Int64Value();
  opts_.timeout = Value(opt["timeout"]).ToNumber().Uint32Value();
  opts_.preset = Value(opt["preset"]).ToNumber().Uint32Value();
  opts_.check = (lzma_check)Value(opt["check"]).ToNumber().Int32Value();
  opts_.threads = Value(opt["threads"]).ToNumber().Uint32Value();

  if (opts_.threads == 0) {
    opts_.threads = lzma_cputhreads();
  }

  Value filters = opt["filters"];
  if (filters.IsArray()) {
    filters_.reset(new FilterArray(filters));
    opts_.filters = filters_->array();
  }
}

}
