/* @flow */
import varstruct, { Buffer as Buf, VarBuffer, UInt32BE } from 'varstruct'
import { fromUInt32BE } from './buffer'
import * as scCrypto from './crypto'
import { vsf } from './util'

import { HEADER_LEN_BYTES } from './header'
import { METADATA_LEN_BYTES } from './metadata'

export const struct = varstruct(vsf([
  ['header', Buf(HEADER_LEN_BYTES)],
  ['checksum', Buf(32)],
  ['metadata', Buf(METADATA_LEN_BYTES)],
  ['blob', VarBuffer(UInt32BE)]
]))

export function decode (fileContents: Buffer): Object {
  return struct.decode(fileContents)
}

export function encode (fileContents: Object): Buffer {
  return struct.encode(fileContents)
}

export function computeChecksum (metadata: Buffer, blob: Buffer): Buffer {
  return scCrypto.sha256(Buffer.concat([metadata, fromUInt32BE(blob.byteLength), blob]))
}

export function checkContents (fileContents: Buffer): boolean {
  let fileObj = decode(fileContents)
  return fileObj.checksum.equals(computeChecksum(fileObj.metadata, fileObj.blob))
}
