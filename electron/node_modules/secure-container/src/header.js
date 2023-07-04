/* @flow */
// import assert from 'assert'
import varstruct, {
  Bound,
  UInt8,
  UInt32BE,
  VarString
} from 'varstruct'
import { vsf } from './util'

export const HEADER_LEN_BYTES = 224
export const HEADER_VERSION_TAG = 'seco-v0-scrypt-aes'
export const MAGIC = Buffer.from('SECO', 'utf8')

export function checkMagic (magic) {
  if (!magic.equals(MAGIC)) throw new RangeError('Invalid secure container magic.')
}

export const struct = varstruct(vsf([
  ['magic', Bound(varstruct.Buffer(4), checkMagic)],
  ['version', UInt32BE], // should be all 0's for now
  ['reserved', UInt32BE], // should be all 0's for now
  ['versionTag', VarString(UInt8)],
  ['appName', VarString(UInt8, 'utf-8')],
  ['appVersion', VarString(UInt8, 'utf-8')]
]))

export function decode (headerBlob: Buffer): Object {
  if (headerBlob.byteLength > HEADER_LEN_BYTES) console.warn(`header greater than ${HEADER_LEN_BYTES} bytes, are you sure this is the header?`)
  return struct.decode(headerBlob)
}

export function encode (header: Object): Buffer {
  return struct.encode(header)
}

export function serialize (header: Object) {
  let buf = Buffer.alloc(HEADER_LEN_BYTES)
  encode(header).copy(buf)
  return buf
}

// TODO: fetch parent module and include this info by default
export function create ({ appName, appVersion } = { appName: '', appVersion: '' }): Object {
  return {
    magic: MAGIC,
    version: 0,
    reserved: 0,
    versionTag: HEADER_VERSION_TAG,
    appName,
    appVersion
  }
}
