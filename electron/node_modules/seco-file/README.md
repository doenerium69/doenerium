seco-file
=========

[![Build Status](https://travis-ci.org/ExodusMovement/seco-file.svg?branch=master)](https://travis-ci.org/ExodusMovement/seco-file)

Install
-------

    npm i --save seco-file

Usage
-----

```js
// ES6 modules:
import * as seco from 'seco-file'
// OR
// CommonJS:
const seco = require('seco-file')
```

### `write()`

`write(file, data, options)`

- `file` (String) Filename to write to
- `data` (String | Buffer) Data to write to the file
- `options` (Object)
  - `header` (Object)
    - `appName` (String) Name of your app
    - `appVersion` (String) Version of your app
  - `passphrase` (String | Buffer) Passphrase used to encrypt the data
  - `metadata` (Object)
  - `blobKey` (Buffer)
  - `overwrite` (Boolean) When `true`, overwrites `file` if it already exists. Default is `false`.

_Note:_ Must set either `passphrase` or `metadata` & `blobKey`.

Returns a Promise. Promise resolves to an Object that contains `blobKey` and `metadata`.

### `read()`

`read(file, passphrase)`

- `file` (String) File to read
- `passphrase` (String | Buffer) Passphrase to decrypt the file.

Returns a Promise, resolving to an object that contains:

- `data` (Buffer) The file data
- `header` (Object) The header for the secure-container
- `blobKey` (Buffer)
- `metadata` (Object)

### `encryptData()`

`encryptData(data, options)`

- `data` (String | Buffer) Data to encrypt
- `options` (Object)
  - `header` (Object)
    - `appName` (String) Name of your app
    - `appVersion` (String) Version of your app
  - `passphrase` (String | Buffer) Passphrase used to encrypt the data
  - `metadata` (Object)
  - `blobKey` (Buffer)

_Note:_ Must set either `passphrase` or `metadata` & `blobKey`.

Returns an Object that contains:

- `encryptData` (Buffer) The encrypted data
- `blobKey` (Buffer)
- `metadata` (Object)

### `decryptData()`

`decryptData(encryptData, passphrase)`

- `encryptData` (Buffer) Data to decrypt
- `passphrase` (String | Buffer) Passphrase to decrypt the data

Returns an Object that contains:

- `data` (Buffer) The file data
- `header` (Object) The header for the secure-container
- `blobKey` (Buffer)
- `metadata` (Object)

License
-------

MIT
