# node-api-version

Get the maximum Node-API version supported for a specific version of node or Electron.

```js
const { fromNodeVersion, fromElectronVersion } = require("node-api-version");

fromNodeVersion("9.0.0"); // undefined
fromNodeVersion("12.13.0"); // 5

fromElectronVersion("2.0.0"); // undefined
fromElectronVersion("13.0.0"); // 7
fromElectronVersion("15.0.0-nightly.20210629"); // 8
```
