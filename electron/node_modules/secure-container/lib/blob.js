'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = encrypt;
exports.decrypt = decrypt;

var _crypto = require('./crypto');

var scCrypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function encrypt(message, metadata, blobKey) {
  const { authTag, iv, blob } = scCrypto.aesEncrypt(blobKey, message);
  metadata.blob = { authTag, iv };
  return { blob, blobKey };
}
function decrypt(blob, metadata, blobKey) {
  const message = scCrypto.aesDecrypt(blobKey, blob, metadata.blob);
  return message;
}