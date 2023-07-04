secure-container
================

[![Build Status](https://travis-ci.org/ExodusMovement/secure-container.svg?branch=master)](https://travis-ci.org/ExodusMovement/secure-container)


Install
-------

    npm i --save secure-container



API
-----

### `header` module

```js
import * as header from 'secure-container/lib/header'
// OR
const header = require('secure-container/lib/header')
```

#### `header.create(data)`

Create a header object.

- `data` (Object)
  - `appName` (String) Name of your app
  - `appVersion` (String) Version of your app

Returns an Object.

#### `header.serialize(headerObj)`

Serialize a header object. `headerObj` is a header object made with `create()`. Returns a Buffer.

#### `header.decode(buffer)`

Decodes a header buffer and returns the Object.

### `metadata` module

```js
import * as metadata from 'secure-container/lib/metadata'
// OR
const metadata = require('secure-container/lib/metadata')
```

#### `metadata.create()`

Create a metadata object. Returns an Object.

#### `metadata.encryptBlobKey(metadata, passphrase, blobKey)`

- `metadata` (Object) Metadata created with `metadata.create()`.
- `passphrase` (String | Buffer)
- `blobKey` (Buffer)

Mutates `metadata` object; returns `undefined`.

#### `metadata.serialize(metadata)`

Serialize a metadata object. Returns a Buffer.

#### `metadata.decode(buffer)`

Takes a metadata buffer, decodes it, and returns an object.

#### `metadata.decryptBlobKey(metadata, passphrase)`

- `metadata` (Object) Metadata with an encrypted blobKey.
- `passphrase` (String | Buffer)

Returns `blobKey` as a buffer.

### `blob` module

```js
import * as blob from 'secure-container/lib/blob'
// OR
const blob = require('secure-container/lib/blob')
```

#### `blob.encrypt(data, metadata, blobKey)`

- `data` (Buffer) Data or message to encrypt.
- `metadata` (Object) Metadata object.
- `blobKey` (Buffer)

Mutates `metadata`. Returns an object:

- `blob` (Buffer) Encrypted data.
- `blobKey` (Buffer) The `blobKey` you passed in.

#### `blob.decrypt(blob, metadata, blobKey)`

- `blob` (Buffer) Encrypted data.
- `metadata` (Object) Metadata object.
- `blobKey` (Buffer)

Returns the decrypted data as a buffer.

### `file` module

```js
import * as file from 'secure-container/lib/file'
// OR
const file = require('secure-container/lib/file')
```

#### `file.computeChecksum(metadata, blob)`

- `metadata` (Buffer) Metadata as a Buffer
- `blob` (Buffer) Encrypted blob

Returns a `sha256` checksum as a buffer.

#### `file.encode(fileObj)`

- `fileObj` (Object)
  - `header` (Buffer) Serialized header
  - `checksum` (Buffer) Checksum from `file.computeChecksum()`
  - `metadata` (Buffer) Metadata as a Buffer
  - `blob` (Buffer) Encrypted blob

Returns a buffer.

#### `file.decode(fileBuffer)`

The opposite of `file.encode()`. Takes a buffer and returns an object.

File Format Description
-----------

This is the documentation for the binary structure of secure containers.

For clarity, we have split the documentation into four sections: `header`, `checksum`, `metadata`, and `blob`.

### Header

Size | Label | Description |
---- | ----- | ----------- |
4 | `magic` | The magic header indicating the file type. Always `SECO`.
4 | `version` | File format version. Currently `0`, stored as `UInt32BE`.
4 | `reserved` | Reserved for future use.
1 | `versionTagLength` | Length of `versionTag` as `UInt8`.
`versionTagLength` | `versionTag` | Should be `'seco-v0-scrypt-aes'`.
1 | `appNameLength` | Length of `appName` as `UInt8`.
`appNameLength` | `appName` | Name of the application writing the file.
1 | `appVersionLength` | Length of `appVersion` as `UInt8`.
`appVersionLength` | `appVersion` | Version of the application writing the file.

### Checksum

32-byte `sha256` checksum of the following data:

1. The `metadata`.
1. Byte-length of the `blob`, stored as `UInt32BE`.
1. The `blob`.

### Metadata

Size | Label | Description |
---- | ----- | ----------- |
32 | `salt` | Scrypt salt.
4 | `n` | Scrypt `n` parameter.
4 | `r` | Scrypt `r` parameter.
4 | `p` | Scrypt `p` parameter.
32 | `cipher` | Currently `aes-256-gcm` stored as a zero-terminated C-string.
12 | `iv` | `blobKey`'s `iv`.
16 | `authTag` | `blobKey`'s `authTag`.
32 | `key` | `blobKey`'s `key`.
12 | `iv` | The `blob`'s `iv`.
16 | `authTag` | The `blob`'s `authTag`.

### Blob

Size | Label | Description |
---- | ----- | ----------- |
4 | `blobLength` | Length of `blob` as `UInt32BE`.
`blobLength` | `blob` | Encrypted data.
