'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.struct = exports.METADATA_LEN_BYTES = undefined;
exports.decode = decode;
exports.encode = encode;
exports.serialize = serialize;
exports.create = create;
exports.encryptBlobKey = encryptBlobKey;
exports.decryptBlobKey = decryptBlobKey;

var _varstruct = require('varstruct');

var _varstruct2 = _interopRequireDefault(_varstruct);

var _crypto = require('./crypto');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const METADATA_LEN_BYTES = exports.METADATA_LEN_BYTES = 256;
const struct = exports.struct = (0, _varstruct2.default)((0, _util.vsf)([['scrypt', [['salt', (0, _varstruct.Buffer)(32)], ['n', _varstruct.UInt32BE], ['r', _varstruct.UInt32BE], ['p', _varstruct.UInt32BE]]], ['cipher', (0, _util.CStr)(32)], ['blobKey', [['iv', (0, _varstruct.Buffer)(_crypto.IV_LEN_BYTES)], ['authTag', (0, _varstruct.Buffer)(16)], ['key', (0, _varstruct.Buffer)(32)]]], ['blob', [['iv', (0, _varstruct.Buffer)(_crypto.IV_LEN_BYTES)], ['authTag', (0, _varstruct.Buffer)(16)]]]]));

function decode(metadataBlob) {
  if (metadataBlob.byteLength > METADATA_LEN_BYTES) console.warn('metadata greater than `${METADATA_LEN_BYTES}` bytes, are you sure this is the SECO metadata?');
  return struct.decode(metadataBlob);
}

function encode(metadataObject) {
  return struct.encode(metadataObject);
}

function serialize(metadata) {
  let buf = Buffer.alloc(METADATA_LEN_BYTES);
  encode(metadata).copy(buf);
  return buf;
}

function create(scryptParams = (0, _crypto.createScryptParams)()) {
  return {
    scrypt: scryptParams,
    cipher: 'aes-256-gcm',
    blobKey: {
      iv: Buffer.alloc(_crypto.IV_LEN_BYTES),
      authTag: Buffer.alloc(16),
      key: Buffer.alloc(32)
    },
    blob: {
      iv: Buffer.alloc(_crypto.IV_LEN_BYTES),
      authTag: Buffer.alloc(16)
    }
  };
}

function encryptBlobKey(metadata, passphrase, blobKey) {
  const { authTag, blob, iv, salt } = (0, _crypto.boxEncrypt)(passphrase, blobKey, metadata.scrypt);
  metadata.scrypt.salt = salt;
  metadata.blobKey = { authTag, iv, key: blob };
}

function decryptBlobKey(metadata, passphrase) {
  const blobKey = (0, _crypto.boxDecrypt)(passphrase, metadata.blobKey.key, metadata.blobKey, metadata.scrypt);
  return blobKey;
}