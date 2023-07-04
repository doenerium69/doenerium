1.2.0 / 2018-02-22
------------------
- Add `encryptData()` & `decryptData()` methods
- Upgrade dependencies

1.1.1 / 2017-05-19
------------------
- Remove runtime type checks
- Upgrade secure-container version (no breaking changes)

1.1.0 / 2017-05-17
------------------
- Return `header` from `readFile()`
- Don't use `new Buffer()`
- Update dependencies

1.0.1 / 2017-03-24
------------------
- add `README` to package.json

1.0.0 / 2017-03-24
------------------
- BREAKING: modify `read()` to return blobKey and metadata [#3]
- check checksum to be valid on `read()` [#2]

0.0.3 / 2016-06-23
------------------
- remove auto package.json include of parent

0.0.2 / 2016-06-23
------------------
- bug fix: subtle type check fix `String` vs `string`

0.0.1 / 2016-06-23
------------------
- initial release
