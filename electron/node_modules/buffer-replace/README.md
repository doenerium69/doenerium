
# buffer-replace

Like `String#replace`, but for buffers.

## Usage

```js
const replace = require('buffer-replace');

replace(Buffer('foo:bar'), ':', '-')
// Buffer('foo-bar')

replace(Buffer('foo-beep-bar'), '-beep-', '-');
// Buffer('foo-bar')

replace('foo-beep-bar', '-beep-', '-');
// Buffer('foo-bar')
```

## Installation

```bash
$ npm install buffer-replace
```

## API

### replace(buf, a, b)

Replace all occurences of `a` in `buf` with `b`. All arguments can be either buffers or strings, but the return value is always a buffer.

## License

MIT
