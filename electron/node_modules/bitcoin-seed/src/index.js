var bip39 = require('bip39')
var crypto = require('crypto')

function create () {
  var bitcoinSeed = Object.create(null)

  bitcoinSeed.isDestroyed = false
  // TODO: remove
  bitcoinSeed.mnemonic = Buffer.alloc(0)

  bitcoinSeed.entropy = Buffer.alloc(0)
  bitcoinSeed.seed = Buffer.alloc(0)

  Object.defineProperty(bitcoinSeed, 'mnemonicString', {
    get: function () {
      return bip39.entropyToMnemonic(bitcoinSeed.entropy.toString('hex'))
    }
  })

  bitcoinSeed.destroy = function destroy () {
    this.seed.fill(0)
    this.mnemonic.fill(0)
    this.entropy.fill(0)
    this.isDestroyed = true
  }

  bitcoinSeed.toJSON = function toJSON () {
    throw new Error('<bitcoin-seed> Error: Convert each Buffer to JSON individually.')
  }

  // => seed || mnemonic
  bitcoinSeed.serializeOld = function serialize () {
    var b = Buffer.alloc(this.seed.length + this.mnemonic.length)
    this.seed.copy(b)
    this.mnemonic.copy(b, this.seed.length)
    return b
  }

  // => seed || entropy
  bitcoinSeed.serialize = function serialize () {
    var b = Buffer.alloc(this.seed.length + this.entropy.length)
    this.seed.copy(b)
    this.entropy.copy(b, this.seed.length)
    return b
  }

  return bitcoinSeed
}

// NOTE: after calling this, don't forget to zero out the input buffer
// could use slice() here, but in Browserify Buffer, that may be deceiving in
// older browsers: https://github.com/feross/buffer#in-old-browsers-bufslice-does-not-modify-parent-buffers-memory
// may be an acceptable tradeoff at some point
function fromBuffer (buffer) {
  var bs = create()
  bs.seed = Buffer.alloc(64)

  // retain backwards compatibility with old serialized version
  var data = Buffer.alloc(buffer.length - 64)
  buffer.copy(data, 0, 64, buffer.length)

  if (data.length === 16) {
    bs.mnemonic = Buffer.from(bip39.entropyToMnemonic(data.toString('hex')), 'utf8')
    data.fill(0)
  } else if (data.length === 32) {
    bs.mnemonic = Buffer.from(bip39.entropyToMnemonic(data.toString('hex')), 'utf8')
    data.fill(0)
  } else {
    bs.mnemonic = data
  }

  bs.entropy = Buffer.from(bip39.mnemonicToEntropy(bs.mnemonic.toString('utf8')), 'hex')

  buffer.copy(bs.seed, 0, 0, 64)

  return bs
}

function fromMnemonic (mnemonic, passphrase) {
  if (typeof mnemonic !== 'string') throw new Error('fromMnemonic(): Must pass type "string" as mnemonic.')
  var bs = create()
  bs.mnemonic = Buffer.from(mnemonic, 'utf8')
  bs.entropy = Buffer.from(bip39.mnemonicToEntropy(mnemonic), 'hex')
  bs.seed = bip39.mnemonicToSeed(mnemonic, passphrase)
  return bs
}

function fromEntropy (entropy, passphrase) {
  if (!Buffer.isBuffer(entropy)) throw new Error('fromEntropy(): Must pass a buffer.')
  var bs = create()
  var mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'))
  bs.mnemonic = Buffer.from(mnemonic, 'utf8')
  bs.entropy = entropy
  bs.seed = bip39.mnemonicToSeed(mnemonic, passphrase)
  return bs
}

// options = { entropyFn, passphrase }
function fromRandom (options) {
  options = options || { entropyFn: function () {} }

  // entropyFn MUST return a 16 byte Buffer
  var rndBytesHex = (options.entropyFn() || crypto.randomBytes(16)).toString('hex')
  var mnemonic = bip39.entropyToMnemonic(rndBytesHex)

  return fromMnemonic(mnemonic, options.passphrase)
}

function isBitcoinSeed (bs) {
  return bs.entropy && bs.seed && ('isDestroyed' in bs)
}

module.exports = {
  create: create,
  isBitcoinSeed: isBitcoinSeed,
  fromBuffer: fromBuffer,
  fromEntropy: fromEntropy,
  fromMnemonic: fromMnemonic,
  fromRandom: fromRandom
}
