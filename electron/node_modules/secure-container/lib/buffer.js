"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromUInt32BE = fromUInt32BE;
function fromUInt32BE(num) {
  let buf = Buffer.alloc(4);
  buf.writeUInt32BE(num);
  return buf;
}