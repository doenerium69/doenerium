/* @flow */
import * as scCrypto from './crypto'

export function encrypt (message: Buffer, metadata: Object, blobKey: Buffer) {
  const { authTag, iv, blob } = scCrypto.aesEncrypt(blobKey, message)
  metadata.blob = { authTag, iv }
  return { blob, blobKey }
}

export function decrypt (blob: Buffer, metadata: Object, blobKey: Buffer): Buffer {
  const message = scCrypto.aesDecrypt(blobKey, blob, metadata.blob)
  return message
}
