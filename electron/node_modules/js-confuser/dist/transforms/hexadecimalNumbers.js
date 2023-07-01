"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transform = _interopRequireDefault(require("./transform"));

var _order = require("../order");

var _gen = require("../util/gen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The HexadecimalNumbers transformation converts number literals into the hexadecimal form.
 *
 * This is done by replacing the number literal with an Identifier to ensure escodegen properly outputs it as such
 *
 * This transformation also handles BigInt support, so its always enabled for this reason.
 */
class HexadecimalNumbers extends _transform.default {
  constructor(o) {
    super(o, _order.ObfuscateOrder.HexadecimalNumbers);
  }

  isNumberLiteral(object) {
    return object.type === "Literal" && typeof object.value === "number" && Math.floor(object.value) === object.value;
  }

  isBigIntLiteral(object) {
    return object.type === "Literal" && typeof object.value === "bigint";
  }

  match(object, parents) {
    return this.options.hexadecimalNumbers && this.isNumberLiteral(object) || this.isBigIntLiteral(object);
  }

  transform(object, parents) {
    if (this.isNumberLiteral(object)) {
      return () => {
        // Technically, a Literal will never be negative because it's supposed to be inside a UnaryExpression with a "-" operator.
        // This code handles it regardless
        var isNegative = object.value < 0;
        var hex = Math.abs(object.value).toString(16);
        var newStr = (isNegative ? "-" : "") + "0x" + hex;
        this.replace(object, (0, _gen.Identifier)(newStr));
      };
    } // https://github.com/MichaelXF/js-confuser/issues/79


    if (this.isBigIntLiteral(object)) {
      return () => {
        // Use an Identifier with the raw string
        this.replace(object, (0, _gen.Identifier)(object.raw));
      };
    }
  }

}

exports.default = HexadecimalNumbers;