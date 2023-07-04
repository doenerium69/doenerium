"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transform = _interopRequireDefault(require("../transform"));

var _random = require("../../util/random");

var _compare = require("../../util/compare");

var _stringConcealing = require("./stringConcealing");

var _probability = require("../../probability");

var _gen = require("../../util/gen");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pad(x, len) {
  while (x.length < len) {
    x = "0" + x;
  }

  return x;
}

function even(x) {
  if (x.length % 2 != 0) {
    return "0" + x;
  }

  return x;
}

function toHexRepresentation(str) {
  var escapedString = "";
  str.split("").forEach(char => {
    var code = char.charCodeAt(0);

    if (code < 128) {
      escapedString += "\\x" + even(pad(code.toString(16), 2));
    } else {
      escapedString += char;
    }
  });
  return escapedString;
}

function toUnicodeRepresentation(str) {
  var escapedString = "";
  str.split("").forEach(char => {
    var code = char.charCodeAt(0);

    if (code < 128) {
      escapedString += "\\u" + even(pad(code.toString(16), 4));
    } else {
      escapedString += char;
    }
  });
  return escapedString;
}
/**
 * [String Encoding](https://docs.jscrambler.com/code-integrity/documentation/transformations/string-encoding) transforms a string into an encoded representation.
 *
 * - Potency Low
 * - Resilience Low
 * - Cost Low
 */


class StringEncoding extends _transform.default {
  constructor(o) {
    super(o);
  }

  match(object, parents) {
    return object.type == "Literal" && typeof object.value === "string" && object.value.length > 0 && !(0, _stringConcealing.isModuleSource)(object, parents) && !(0, _compare.isDirective)(object, parents);
  }

  transform(object, parents) {
    // Allow percentages
    if (!(0, _probability.ComputeProbabilityMap)(this.options.stringEncoding, x => x, object.value)) return;
    var type = (0, _random.choice)(["hexadecimal", "unicode"]);
    var escapedString = (type == "hexadecimal" ? toHexRepresentation : toUnicodeRepresentation)(object.value);
    return () => {
      if (object.type !== "Literal") return; // ESCodeGen tries to escape backslashes, here is a work-around

      this.replace(object, (0, _gen.Identifier)("'".concat(escapedString, "'")));
    };
  }

}

exports.default = StringEncoding;