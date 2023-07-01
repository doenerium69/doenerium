"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _order = require("../order");

var _gen = require("../util/gen");

var _stringEncoding = _interopRequireDefault(require("./string/stringEncoding"));

var _transform = _interopRequireDefault(require("./transform"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * The Finalizer is the last transformation before the code is ready to be generated.
 *
 * Hexadecimal numbers:
 * - Convert integer literals into `Identifier` nodes with the name being a hexadecimal number
 *
 * BigInt support:
 * - Convert BigInt literals into `Identifier` nodes with the name being the raw BigInt string value + "n"
 *
 * String Encoding:
 * - Convert String literals into `Identifier` nodes with the name being a unicode escaped string
 */
class Finalizer extends _transform.default {
  constructor(o) {
    super(o, _order.ObfuscateOrder.Finalizer);

    _defineProperty(this, "stringEncoding", void 0);

    this.stringEncoding = new _stringEncoding.default(o);
  }

  isNumberLiteral(object) {
    return object.type === "Literal" && typeof object.value === "number" && Math.floor(object.value) === object.value;
  }

  isBigIntLiteral(object) {
    return object.type === "Literal" && typeof object.value === "bigint";
  }

  match(object, parents) {
    return object.type === "Literal";
  }

  transform(object, parents) {
    // Hexadecimal Numbers
    if (this.options.hexadecimalNumbers && this.isNumberLiteral(object)) {
      return () => {
        // Technically, a Literal will never be negative because it's supposed to be inside a UnaryExpression with a "-" operator.
        // This code handles it regardless
        var isNegative = object.value < 0;
        var hex = Math.abs(object.value).toString(16);
        var newStr = (isNegative ? "-" : "") + "0x" + hex;
        this.replace(object, (0, _gen.Identifier)(newStr));
      };
    } // BigInt support


    if (this.isBigIntLiteral(object)) {
      // https://github.com/MichaelXF/js-confuser/issues/79
      return () => {
        // Use an Identifier with the raw string
        this.replace(object, (0, _gen.Identifier)(object.raw));
      };
    }

    if (this.options.stringEncoding && this.stringEncoding.match(object, parents)) {
      return this.stringEncoding.transform(object, parents);
    }
  }

}

exports.default = Finalizer;