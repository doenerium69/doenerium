import crypto from 'crypto'
import scrypt from 'scryptsy'

// http://csrc.nist.gov/publications/nistpubs/800-38D/SP-800-38D.pdf 8.2.2 RBG-based Construction (about initialization vectors)
export const IV_LEN_BYTES = 12 // <-- always 12, any other value will error, not sure why it won't allow higher... probably concat with freefield?

export function createScryptParams (params = {}) : Object {
  return { salt: crypto.randomBytes(32), n: 16384, r: 8, p: 1, ...params }
}

// always returns 32 byte key
export function stretchPassphrase (passphrase: string | Buffer, { salt, n, r, p } = createScryptParams()) : Object {
  const key = scrypt(passphrase, salt, n, r, p, 32)
  return { key, salt }
}

export function aesEncrypt (key: Buffer, message: Buffer, opts = { cipher: 'aes-256-gcm', iv: crypto.randomBytes(IV_LEN_BYTES) }) : Object {
  const cipher = crypto.createCipheriv(opts.cipher, key, opts.iv)
  const blob = Buffer.concat([cipher.update(message), cipher.final()])
  const authTag = cipher.getAuthTag()
  return { authTag, blob, iv: opts.iv }
}

export function aesDecrypt (key: Buffer, blob: Buffer, { cipher = 'aes-256-gcm', iv, authTag } = {}) : Buffer {
  const decipher = crypto.createDecipheriv(cipher, key, iv)
  decipher.setAuthTag(authTag)
  const message = Buffer.concat([decipher.update(blob), decipher.final()])
  return message
}

export function boxEncrypt (passphrase: string | Buffer, message: Buffer, scryptParams) {
  const { key, salt } = stretchPassphrase(passphrase, scryptParams)
  const { authTag, blob, iv } = aesEncrypt(key, message)
  return { authTag, blob, iv, salt }
}

export function boxDecrypt (passphrase: string | Buffer, blob: Buffer, { iv, authTag }, scryptParams) {
  scryptParams = { ...createScryptParams(), ...scryptParams }
  const { key } = stretchPassphrase(passphrase, scryptParams)
  const message = aesDecrypt(key, blob, { iv, authTag })
  return message
}

export function sha256 (message: Buffer): Buffer {
  return crypto.createHash('sha256').update(message).digest()
}
