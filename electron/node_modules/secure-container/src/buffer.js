/* @flow */

export function fromUInt32BE (num: number): Buffer {
  let buf = Buffer.alloc(4)
  buf.writeUInt32BE(num)
  return buf
}
