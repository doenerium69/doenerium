'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = undefined;
exports.decode = decode;
exports.encode = encode;
exports.computeChecksum = computeChecksum;
exports.checkContents = checkContents;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _buffer = require('./buffer');

var _crypto = require('./crypto');

var scCrypto = _interopRequireWildcard(_crypto);

var _util = require('./util');

var _header = require('./header');

var _metadata = require('./metadata');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['header', (0, _varstruct.Buffer)(_header.HEADER_LEN_BYTES)], ['checksum', (0, _varstruct.Buffer)(32)], ['metadata', (0, _varstruct.Buffer)(_metadata.METADATA_LEN_BYTES)], ['blob', (0, _varstruct.VarBuffer)(_varstruct.UInt32BE)]]));

function decode(fileContents) {
  return struct.decode(fileContents);
}

function encode(fileContents) {
  return struct.encode(fileContents);
}

function computeChecksum(metadata, blob) {
  return scCrypto.sha256(Buffer.concat([metadata, (0, _buffer.fromUInt32BE)(blob.byteLength), blob]));
}

function checkContents(fileContents) {
  let fileObj = decode(fileContents);
  return fileObj.checksum.equals(computeChecksum(fileObj.metadata, fileObj.blob));
}