'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vsf = vsf;
exports.CStr = CStr;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function vsf(fields) {
  return fields.map(fields => ({
    name: fields[0],
    type: Array.isArray(fields[1]) ? (0, _varstruct2.default)(vsf(fields[1])) : fields[1]
  }));
}

// zero-terminated C-string (Buffer)

function CStr(length, encoding = 'utf8') {
  let bufferCodec = (0, _varstruct.Buffer)(length);

  function encode(value, buffer, offset) {
    let buf = Buffer.alloc(length);
    buf.write(value, encoding);
    return bufferCodec.encode(buf, buffer, offset);
  }

  function decode(buffer, offset, end) {
    let buf = bufferCodec.decode(buffer, offset, end);
    let i = 0;
    for (; i < buf.length; i++) if (buf[i] === 0) break;
    return buf.slice(0, i).toString(encoding);
  }

  const encodingLength = () => length;

  // TODO: submit pr on varstruct if 'bytes' is undefined
  encode.bytes = decode.bytes = length;

  return { encode, decode, encodingLength };
}