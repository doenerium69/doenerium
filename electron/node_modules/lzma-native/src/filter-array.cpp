#include "liblzma-node.hpp"

namespace lzma {

FilterArray::FilterArray(Value val) {
  Env env = val.Env();
  HandleScope handle_scope(env);

  if (!val.IsArray())
    throw TypeError::New(env, "Filter array expected");
  Array arr = val.As<Array>();

  size_t len = arr.Length();

  String id_ = String::New(env, "id");
  String options_ = String::New(env, "options");

  for (size_t i = 0; i < len; ++i) {
    Value entry_v = arr[i];
    if (!entry_v.IsObject() || !entry_v.As<Object>().Has(id_))
      throw TypeError::New(env, "Filter array expected");
    Object entry = entry_v.As<Object>();

    String id = Value(entry[id_]).ToString();
    Value opt_v = entry[options_];

    lzma_filter f;
    f.id = FilterByName(id);
    f.options = nullptr;

    bool has_options = !opt_v.IsUndefined() && !opt_v.IsNull();
    if (!has_options && (f.id != LZMA_FILTER_LZMA1 && f.id != LZMA_FILTER_LZMA2)) {
      filters.push_back(f);
      continue;
    }

    Object opt = has_options ? opt_v.ToObject() : Object::New(env);

    optbuf.push_back(options());
    union options& bopt = optbuf.back();

    switch (f.id) {
      case LZMA_FILTER_DELTA:
        bopt.delta.type = (lzma_delta_type) GetIntegerProperty(opt, "type", LZMA_DELTA_TYPE_BYTE);
        bopt.delta.dist = GetIntegerProperty(opt, "dist", 1);
        f.options = &bopt.delta;
        break;
      case LZMA_FILTER_LZMA1:
      case LZMA_FILTER_LZMA2:
        bopt.lzma = parseOptionsLZMA(opt);
        f.options = &bopt.lzma;
        break;
      default:
        throw TypeError::New(env, "LZMA wrapper library understands .options only for DELTA and LZMA1, LZMA2 filters");
    }

    filters.push_back(f);
  }

  lzma_filter end;
  end.id = LZMA_VLI_UNKNOWN;
  filters.push_back(end);
}

}
