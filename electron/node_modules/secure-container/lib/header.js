'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.MAGIC = exports.HEADER_VERSION_TAG = exports.HEADER_LEN_BYTES = undefined;
exports.checkMagic = checkMagic;
exports.decode = decode;
exports.encode = encode;
exports.serialize = serialize;
exports.create = create;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import assert from 'assert'
const HEADER_LEN_BYTES = exports.HEADER_LEN_BYTES = 224;
const HEADER_VERSION_TAG = exports.HEADER_VERSION_TAG = 'seco-v0-scrypt-aes';
const MAGIC = exports.MAGIC = Buffer.from('SECO', 'utf8');

function checkMagic(magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.');
}

const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['magic', (0, _varstruct.Bound)(_varstruct2.default.Buffer(4), checkMagic)], ['version', _varstruct.UInt32BE], // should be all 0's for now
['reserved', _varstruct.UInt32BE], // should be all 0's for now
['versionTag', (0, _varstruct.VarString)(_varstruct.UInt8)], ['appName', (0, _varstruct.VarString)(_varstruct.UInt8, 'utf-8')], ['appVersion', (0, _varstruct.VarString)(_varstruct.UInt8, 'utf-8')]]));

function decode(headerBlob) {
  if (headerBlob.byteLength > HEADER_LEN_BYTES) console.warn(`header greater than ${HEADER_LEN_BYTES} bytes, are you sure this is the header?`);
  return struct.decode(headerBlob);
}

function encode(header) {
  return struct.encode(header);
}

function serialize(header) {
  let buf = Buffer.alloc(HEADER_LEN_BYTES);
  encode(header).copy(buf);
  return buf;
}

// TODO: fetch parent module and include this info by default
function create({ appName, appVersion } = { appName: '', appVersion: '' }) {
  return {
    magic: MAGIC,
    version: 0,
    reserved: 0,
    versionTag: HEADER_VERSION_TAG,
    appName,
    appVersion
  };
}