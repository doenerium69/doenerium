# `trim-buffer`

> Removes whitespace and line-terminator characters from buffer edges

## Installation

```bash
$ npm i -S trim-buffer
$ yarn add trim-buffer
```

## Usage

```js
import { EOL } from 'os';
import { trimBufferStart, trimBufferEnd, trimBuffer } from 'trim-buffer';

const trimmable = Buffer.from(` trimme${EOL}`); // Buffer(8) [32, 116, 114, 105, 109, 109, 101, 10]
trimBufferStart(trimmable); // Buffer(7) [116, 114, 105, 109, 109, 101, 10]
trimBufferEnd(trimmable); // Buffer(7) [32, 116, 114, 105, 109, 109, 101]
trimBuffer(trimmable); // Buffer(6) [116, 114, 105, 109, 109, 101]
```

## API

> Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) and all the line terminator characters (LF, CR, etc.).

### `trimBufferStart(buffer: Buffer): Buffer`

The `trimBufferStart()` method return the buffer stripped of whitespace from its left end. `trimBufferStart()` do not affect the value of the buffer itself.
Exactly what [String.prototype.trimStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart) does, just for buffers.

### `trimBufferEnd(buffer: Buffer): Buffer`

The `trimBufferEnd()` method return the buffer stripped of whitespace from its right end. `trimBufferEnd()` do not affect the value of the buffer itself.
Exactly what [String.prototype.trimEnd()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd) does, just for buffers.

### `trimBuffer(buffer: Buffer): Buffer`

The `trimBuffer()` method return the buffer stripped of whitespace both ends. `trimBuffer()` do not affect the value of the buffer itself.
Exactly what [String.prototype.trim()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim) does, just for buffers.
