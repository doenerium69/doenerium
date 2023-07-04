/* flow */
import fs from 'fs-extra'
import * as crypto from 'crypto'
import * as conBlob from 'secure-container/lib/blob'
import * as conHeader from 'secure-container/lib/header'
import * as conMetadata from 'secure-container/lib/metadata'
import * as conFile from 'secure-container/lib/file'

type BufOrStr = Buffer | string

// options: passphrase, blobKey, metdata
export function encryptData (data: BufOrStr, options = {}) {
  if (!options.header) console.warn('seco-file: should pass options.header.')
  let header = conHeader.create(options.header)

  let blobKey
  let metadata
  if (options.passphrase) {
    blobKey = crypto.randomBytes(32)
    metadata = conMetadata.create()
    conMetadata.encryptBlobKey(metadata, options.passphrase, blobKey)
  } else if (options.metadata && options.blobKey) {
    blobKey = options.blobKey
    metadata = options.metadata
  } else {
    throw new Error('Must set either passphrase or (metadata and blobKey)')
  }

  data = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  let { blob: encBlob } = conBlob.encrypt(data, metadata, blobKey)

  const headerBuf = conHeader.serialize(header)
  const mdBuf = conMetadata.serialize(metadata)

  let fileObj = {
    header: headerBuf,
    checksum: conFile.computeChecksum(mdBuf, encBlob),
    metadata: mdBuf,
    blob: encBlob
  }
  const encryptedData = conFile.encode(fileObj)

  return { encryptedData, blobKey, metadata }
}

export function decryptData (encryptedData: Buffer, passphrase: BufOrStr) {
  const fileObj = conFile.decode(encryptedData)

  const checksum = conFile.computeChecksum(fileObj.metadata, fileObj.blob)
  if (!fileObj.checksum.equals(checksum)) throw new Error(`seco checksum does not match; data may be corrupted`)

  let metadata = conMetadata.decode(fileObj.metadata)
  let blobKey = conMetadata.decryptBlobKey(metadata, passphrase)
  let header = conHeader.decode(fileObj.header)
  let data = conBlob.decrypt(fileObj.blob, metadata, blobKey)

  return { data, blobKey, metadata, header }
}

// options: passphrase, blobKey, metdata, overwrite
export async function write (file: string, data: BufOrStr, options = {}) {
  options = { overwrite: false, ...options }

  if (!options.overwrite && await fs.pathExists(file)) throw new Error(`${file} exists. Set 'overwrite' to true.`)

  const { encryptedData, blobKey, metadata } = encryptData(data, options)

  await fs.outputFile(file, encryptedData)

  return { blobKey, metadata }
}

export async function read (file: string, passphrase: BufOrStr) {
  let fileData = await fs.readFile(file)

  let result
  try {
    result = decryptData(fileData, passphrase)
  } catch (e) {
    if (e.message.match(/seco checksum does not match; data may be corrupted/)) {
      throw new Error(`${file}: seco checksum does not match; file may be corrupted`)
    }
    throw e
  }

  return result
}
