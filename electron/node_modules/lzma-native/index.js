(function() {
'use strict';

var stream = require('readable-stream');
var assert = require('assert');
var fs = require('fs');
var util = require('util');

var native = require('node-gyp-build')(__dirname);

Object.assign(exports, native);

// Please do not update this version except as part of a release commit.
exports.version = '8.0.6';

var Stream = exports.Stream;

Stream.curAsyncStreamsCount = 0;

Stream.prototype.getStream = function(options) {
  options = options || {};

  return new JSLzmaStream(this, options);
};

class JSLzmaStream extends stream.Transform {
  constructor(nativeStream, options) {
    super(options);

    this.nativeStream = nativeStream;
    this.synchronous = (options.synchronous || !native.asyncCodeAvailable) ? true : false;
    this.chunkCallbacks = [];

    this.totalIn_ = 0;
    this.totalOut_ = 0;

    this._writingLastChunk = false;
    this._isFinished = false;

    if (!this.synchronous) {
      Stream.curAsyncStreamsCount++;

      var oldCleanup = this.cleanup;
      var countedCleanup = false;
      this.cleanup = () => {
        if (countedCleanup === false) {
          Stream.curAsyncStreamsCount--;
          countedCleanup = true;
        }
        oldCleanup.call(this);
      };
    }

    // always clean up in case of error
    this.once('error-cleanup', this.cleanup);

    this.nativeStream.bufferHandler = (buf, processedChunks, err, totalIn, totalOut) => {
      if (totalIn !== null) {
        this.totalIn_  = totalIn;
        this.totalOut_ = totalOut;
      }

      setImmediate(() => {
        if (err) {
          this.push(null);
          this.emit('error-cleanup', err);
          this.emit('error', err);
          return;
        }

        if (totalIn !== null) {
          this.emit('progress', {
            totalIn: this.totalIn_,
            totalOut: this.totalOut_
          });
        }

        if (typeof processedChunks === 'number') {
          assert.ok(processedChunks <= this.chunkCallbacks.length);

          var chunkCallbacks = this.chunkCallbacks.splice(0, processedChunks);

          while (chunkCallbacks.length > 0)
            chunkCallbacks.shift().call(this);
        } else if (buf === null) {
          if (this._writingLastChunk) {
            this.push(null);
          } else {
            // There may be additional members in the file.
            // Reset and set _isFinished to tell `_flush()` that nothing
            // needs to be done.
            this._isFinished = true;

            if (this.nativeStream && this.nativeStream._restart) {
              this.nativeStream._restart();
            } else {
              this.push(null);
            }
          }
        } else {
          this.push(buf);
        }
      });
    };

    if (typeof options.bufsize !== 'undefined') {
      this.bufsize = options.bufsize;
    }
  }

  get bufsize() {
    return this.setBufsize(null);
  }

  set bufsize(n) {
    if (typeof n !== 'number' || n <= 0) {
      throw new TypeError('bufsize must be a positive number');
    }

    return this.setBufsize(n);
  }

  totalIn() {
    return this.totalIn_;
  }

  totalOut() {
    return this.totalOut_;
  }

  cleanup() {
    if (this.nativeStream) {
      this.nativeStream.resetUnderlying();
    }

    this.nativeStream = null;
  }

  _transform(chunk, encoding, callback) {
    if (!this.nativeStream) return;
    // Split the chunk at 'YZ'. This is used to have a clean boundary at the
    // end of each `.xz` file stream.
    var possibleEndIndex = bufferIndexOfYZ(chunk);
    if (possibleEndIndex !== -1) {
      possibleEndIndex += 2;
      if (possibleEndIndex !== chunk.length) {
        this._transform(chunk.slice(0, possibleEndIndex), encoding, () => {
          this._transform(chunk.slice(possibleEndIndex), encoding, callback);
        });

        return;
      }
    }

    if (this._isFinished && chunk) {
      chunk = skipLeadingZeroes(chunk);

      if (chunk.length > 0) {
        // Real data from a second stream member in the file!
        this._isFinished = false;
      }
    }

    if (chunk && chunk.length === 0) {
      return callback();
    }

    this.chunkCallbacks.push(callback);

    try {
      this.nativeStream.code(chunk, !this.synchronous);
    } catch (e) {
      this.emit('error-cleanup', e);
      this.emit('error', e);
    }
  }

  _writev(chunks, callback) {
    chunks = chunks.map(chunk => chunk.chunk);
    this._write(Buffer.concat(chunks), null, callback);
  }

  _flush(callback) {
    this._writingLastChunk = true;

    if (this._isFinished) {
      this.cleanup();
      callback(null);
      return;
    }

    this._transform(null, null, function() {
      this.cleanup();
      callback.apply(this, arguments);
    });
  }
}

// add all methods from the native Stream
Object.getOwnPropertyNames(native.Stream.prototype).forEach(function(key) {
  if (typeof native.Stream.prototype[key] !== 'function' || key === 'constructor')
    return;
  JSLzmaStream.prototype[key] = function() {
    return this.nativeStream[key].apply(this.nativeStream, arguments);
  };
});

Stream.prototype.rawEncoder = function(options) {
  return this.rawEncoder_(options.filters || []);
};

Stream.prototype.rawDecoder = function(options) {
  return this.rawDecoder_(options.filters || []);
};

Stream.prototype.easyEncoder = function(options) {
  var preset = options.preset || exports.PRESET_DEFAULT;
  var check = options.check || exports.CHECK_CRC32;

  if (typeof options.threads !== 'undefined' && options.threads !== null) {
    return this.mtEncoder_(Object.assign({
      preset: preset,
      filters: null,
      check: check
    }, options));
  } else {
    return this.easyEncoder_(preset, check);
  }
};

Stream.prototype.streamEncoder = function(options) {
  var filters = options.filters || [];
  var check = options.check || exports.CHECK_CRC32;

  if (typeof options.threads !== 'undefined' && options.threads !== null) {
    return this.mtEncoder_(Object.assign({
      preset: null,
      filters: filters,
      check: check
    }, options));
  } else {
    return this.streamEncoder_(filters, check);
  }
};

Stream.prototype.streamDecoder = function(options) {
  this._initOptions = options;
  this._restart = function() {
    this.resetUnderlying();
    this.streamDecoder(this._initOptions);
  };

  return this.streamDecoder_(options.memlimit || null, options.flags || 0);
};

Stream.prototype.autoDecoder = function(options) {
  this._initOptions = options;
  this._restart = function() {
    this.resetUnderlying();
    this.autoDecoder(this._initOptions);
  };

  return this.autoDecoder_(options.memlimit || null, options.flags || 0);
};

Stream.prototype.aloneDecoder = function(options) {
  return this.aloneDecoder_(options.memlimit || null);
};

/* helper functions for easy creation of streams */
var createStream =
exports.createStream = function(coder, options) {
  if (['number', 'object'].indexOf(typeof coder) !== -1 && !options) {
    options = coder;
    coder = null;
  }

  if (parseInt(options) === parseInt(options))
    options = {preset: parseInt(options)};

  coder = coder || 'easyEncoder';
  options = options || {};

  var stream = new Stream();
  stream[coder](options);

  if (options.memlimit)
    stream.memlimitSet(options.memlimit);

  return stream.getStream(options);
};

exports.createCompressor = function(options) {
  return createStream('easyEncoder', options);
};

exports.createDecompressor = function(options) {
  return createStream('autoDecoder', options);
};

exports.crc32 = function(input, encoding, presetCRC32) {
  if (typeof encoding === 'number') {
    presetCRC32 = encoding;
    encoding = null;
  }

  if (typeof input === 'string')
    input = Buffer.from(input, encoding);

  return exports.crc32_(input, presetCRC32 || 0);
};

/* compatibility: node-xz (https://github.com/robey/node-xz) */
exports.Compressor = function(preset, options) {
  options = Object.assign({}, options);

  if (preset)
    options.preset = preset;

  return createStream('easyEncoder', options);
};

exports.Decompressor = function(options) {
  return createStream('autoDecoder', options);
};

/* compatibility: LZMA-JS (https://github.com/nmrugg/LZMA-JS) */
function singleStringCoding(stream, string, on_finish, on_progress) {
  on_progress = on_progress || function() {};
  on_finish = on_finish || function() {};

  // possibly our input is an array of byte integers
  // or a typed array
  if (!Buffer.isBuffer(string))
    string = Buffer.from(string);

  var deferred = {}, failed = false;

  stream.once('error', function(err) {
    failed = true;
    on_finish(null, err);
  });

  // emulate Promise.defer()
  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  // Since using the Promise API is optional, generating unhandled
  // rejections is not okay.
  deferred.promise.catch(noop);

  stream.once('error', function(e) {
    deferred.reject(e);
  });

  var buffers = [];

  stream.on('data', function(b) {
    buffers.push(b);
  });

  stream.once('end', function() {
    var result = Buffer.concat(buffers);

    if (!failed) {
      on_progress(1.0);
      on_finish(result);
    }

    if (deferred)
      deferred.resolve(result);
  });

  on_progress(0.0);

  stream.end(string);

  if (deferred)
    return deferred.promise;
}

exports.LZMA = function() {
  return {
    compress: function(string, mode, on_finish, on_progress) {
      var opt = {};

      if (parseInt(mode) === parseInt(mode) && mode >= 1 && mode <= 9)
        opt.preset = parseInt(mode);

      var stream = createStream('aloneEncoder', opt);

      return singleStringCoding(stream, string, on_finish, on_progress);
    },
    decompress: function(byte_array, on_finish, on_progress) {
      var stream = createStream('autoDecoder');

      return singleStringCoding(stream, byte_array, on_finish, on_progress);
    },
    // dummy, we don’t use web workers
    worker: function() { return null; }
  };
};

exports.compress = function(string, opt, on_finish) {
  if (typeof opt === 'function') {
    on_finish = opt;
    opt = {};
  }

  var stream = createStream('easyEncoder', opt);
  return singleStringCoding(stream, string, on_finish);
};

exports.decompress = function(string, opt, on_finish) {
  if (typeof opt === 'function') {
    on_finish = opt;
    opt = {};
  }

  var stream = createStream('autoDecoder', opt);
  return singleStringCoding(stream, string, on_finish);
};

if (util.promisify) {
  exports.compress[util.promisify.custom] = exports.compress;
  exports.decompress[util.promisify.custom] = exports.decompress;
}

exports.isXZ = function(buf) {
  return buf && buf.length >= 6 &&
         buf[0] === 0xfd &&
         buf[1] === 0x37 &&
         buf[2] === 0x7a &&
         buf[3] === 0x58 &&
         buf[4] === 0x5a &&
         buf[5] === 0x00;
};

exports.parseFileIndex = function(options, callback) {
  if (typeof options !== 'object') {
    throw new TypeError('parseFileIndex needs an options object');
  }

  var p = new native.IndexParser();

  if (typeof options.fileSize !== 'number') {
    throw new TypeError('parseFileeIndex needs options.fileSize');
  }

  if (typeof options.read !== 'function') {
    throw new TypeError('parseFileIndex needs a read callback');
  }

  p.init(options.fileSize, options.memlimit || 0);
  p.read_cb = function(count, offset) {
    var inSameTick = true;
    var bytesRead = count;

    options.read(count, offset, function(err, buffer) {
      if (Buffer.isBuffer(err)) {
        buffer = err;
        err = null;
      }

      if (err) {
        if (typeof callback === 'undefined') {
          throw err;
        }

        return callback(err, null);
      }

      p.feed(buffer);
      bytesRead = buffer.length;

      if (inSameTick) {
        // The call to parse() is still on the call stack and will continue
        // seamlessly.
        return;
      }

      // Kick off parsing again.
      var info;

      try {
        info = p.parse();
      } catch (e) {
        return callback(e, null);
      }

      if (info !== true) {
        return callback(null, cleanupIndexInfo(info));
      }
    });

    inSameTick = false;

    return bytesRead;
  };

  var info;
  try {
    info = p.parse();
  } catch (e) {
    if (typeof callback !== 'undefined') {
      callback(e, null);
      return;
    }

    throw e;
  }

  if (info !== true) {
    info = cleanupIndexInfo(info);
    if (typeof callback !== 'undefined' && info !== true) {
      callback(null, info);
    }

    return info;
  }
};

exports.parseFileIndexFD = function(fd, callback) {
  return fs.fstat(fd, function(err, stats) {
    if (err) {
      return callback(err, null);
    }

    exports.parseFileIndex({
      fileSize: stats.size,
      read: function(count, offset, cb) {
        var buffer = Buffer.allocUnsafe(count);

        fs.read(fd, buffer, 0, count, offset, function(err, bytesRead, buffer) {
          if (err) {
            return cb(err, null);
          }

          if (bytesRead !== count) {
            return cb(new Error('Truncated file!'), null);
          }

          cb(null, buffer);
        });
      }
    }, callback);
  });
};

function cleanupIndexInfo(info) {
  var checkFlags = info.checks;

  info.checks = [];
  for (var i = 0; i < exports.CHECK_ID_MAX; i++) {
    if (checkFlags & (1 << i))
      info.checks.push(i);
  }

  return info;
}

function skipLeadingZeroes(buffer) {
  var i;
  for (i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0x00)
      break;
  }

  return buffer.slice(i);
}

function bufferIndexOfYZ(chunk) {
  if (!chunk) {
    return -1;
  }

  if (chunk.indexOf) {
    return chunk.indexOf('YZ');
  }

  var i;
  for (i = 0; i < chunk.length - 1; i++) {
    if (chunk[i] === 0x59 && chunk[i+1] === 0x5a) {
      return i;
    }
  }

  return -1;
}

function noop() {}

})();
