"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.isModuleSource = isModuleSource;

var _assert = require("assert");

var _order = require("../../order");

var _template = _interopRequireDefault(require("../../templates/template"));

var _traverse = require("../../traverse");

var _compare = require("../../util/compare");

var _gen = require("../../util/gen");

var _insert = require("../../util/insert");

var _random = require("../../util/random");

var _transform = _interopRequireDefault(require("../transform"));

var _encoding = _interopRequireDefault(require("./encoding"));

var _probability = require("../../probability");

var _bufferToString = require("../../templates/bufferToString");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isModuleSource(object, parents) {
  if (!parents[0]) {
    return false;
  }

  if (parents[0].type == "ImportDeclaration" && parents[0].source == object) {
    return true;
  }

  if (parents[0].type == "ImportExpression" && parents[0].source == object) {
    return true;
  }

  if (parents[1] && parents[1].type == "CallExpression" && parents[1].arguments[0] === object && parents[1].callee.type == "Identifier") {
    if (parents[1].callee.name == "require" || parents[1].callee.name == "import") {
      return true;
    }
  }

  return false;
}

class StringConcealing extends _transform.default {
  constructor(o) {
    super(o, _order.ObfuscateOrder.StringConcealing);

    _defineProperty(this, "arrayExpression", void 0);

    _defineProperty(this, "set", void 0);

    _defineProperty(this, "index", void 0);

    _defineProperty(this, "arrayName", this.getPlaceholder());

    _defineProperty(this, "ignore", new Set());

    _defineProperty(this, "variablesMade", 1);

    _defineProperty(this, "encoding", Object.create(null));

    _defineProperty(this, "gen", void 0);

    _defineProperty(this, "hasAllEncodings", void 0);

    this.set = new Set();
    this.index = Object.create(null);
    this.arrayExpression = (0, _gen.ArrayExpression)([]);
    this.hasAllEncodings = false;
    this.gen = this.getGenerator(); // Pad array with useless strings

    var dead = (0, _random.getRandomInteger)(5, 15);

    for (var i = 0; i < dead; i++) {
      var str = (0, _random.getRandomString)((0, _random.getRandomInteger)(5, 40));
      var fn = this.transform((0, _gen.Literal)(str), []);

      if (fn) {
        fn();
      }
    }
  }

  apply(tree) {
    super.apply(tree);
    var cacheName = this.getPlaceholder();
    var bufferToStringName = this.getPlaceholder(); // This helper functions convert UInt8 Array to UTf-string

    (0, _insert.prepend)(tree, ..._bufferToString.BufferToStringTemplate.compile({
      name: bufferToStringName
    }));
    Object.keys(this.encoding).forEach(type => {
      var {
        template
      } = _encoding.default[type];
      var decodeFn = this.getPlaceholder();
      var getterFn = this.encoding[type];
      (0, _insert.append)(tree, template.single({
        name: decodeFn,
        bufferToString: bufferToStringName
      }));
      (0, _insert.append)(tree, (0, _template.default)("\n            \n            function ".concat(getterFn, "(x, y, z, a = ").concat(decodeFn, ", b = ").concat(cacheName, "){\n              if ( z ) {\n                return y[").concat(cacheName, "[z]] = ").concat(getterFn, "(x, y);\n              } else if ( y ) {\n                [b, y] = [a(b), x || z]\n              }\n            \n              return y ? x[b[y]] : ").concat(cacheName, "[x] || (z=(b[x], a), ").concat(cacheName, "[x] = z(").concat(this.arrayName, "[x]))\n            }\n  \n            ")).single());
    });
    var flowIntegrity = this.getPlaceholder();
    (0, _insert.prepend)(tree, (0, _gen.VariableDeclaration)([(0, _gen.VariableDeclarator)(cacheName, (0, _gen.ArrayExpression)([])), (0, _gen.VariableDeclarator)(flowIntegrity, (0, _gen.Literal)(0)), (0, _gen.VariableDeclarator)(this.arrayName, (0, _gen.CallExpression)((0, _gen.FunctionExpression)([], [(0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)("a", this.arrayExpression)), (0, _template.default)("return (".concat(flowIntegrity, " ? a[\"pop\"]() : ").concat(flowIntegrity, "++, a)")).single()]), []))]));
  }

  match(object, parents) {
    return object.type == "Literal" && typeof object.value === "string" && object.value.length >= 3 && !isModuleSource(object, parents) && !(0, _compare.isDirective)(object, parents) //&&

    /*!parents.find((x) => x.$dispatcherSkip)*/
    ;
  }

  transform(object, parents) {
    return () => {
      // Empty strings are discarded
      if (!object.value || this.ignore.has(object.value) || object.value.length == 0) {
        return;
      } // Allow user to choose which strings get changed


      if (!(0, _probability.ComputeProbabilityMap)(this.options.stringConcealing, x => x, object.value)) {
        return;
      } // HARD CODED LIMIT of 10,000 (after 1,000 elements)


      if (this.set.size > 1000 && !(0, _random.chance)(this.set.size / 100)) return;
      var types = Object.keys(this.encoding);
      var type = (0, _random.choice)(types);

      if (!type || !this.hasAllEncodings && (0, _random.chance)(10)) {
        var allowed = Object.keys(_encoding.default).filter(type => !this.encoding[type]);

        if (!allowed.length) {
          this.hasAllEncodings = true;
        } else {
          var random = (0, _random.choice)(allowed);
          type = random;
          this.encoding[random] = this.getPlaceholder();
        }
      }

      var fnName = this.encoding[type];
      var encoder = _encoding.default[type]; // The decode function must return correct result

      var encoded = encoder.encode(object.value);

      if (encoder.decode(encoded) != object.value) {
        this.ignore.add(object.value);
        this.warn(type, object.value.slice(0, 100));
        return;
      }

      var index = -1;

      if (!this.set.has(object.value)) {
        this.arrayExpression.elements.push((0, _gen.Literal)(encoded));
        index = this.arrayExpression.elements.length - 1;
        this.index[object.value] = [index, fnName];
        this.set.add(object.value);
      } else {
        [index, fnName] = this.index[object.value];
        (0, _assert.ok)(typeof index === "number");
      }

      (0, _assert.ok)(index != -1, "index == -1");
      var callExpr = (0, _gen.CallExpression)((0, _gen.Identifier)(fnName), [(0, _gen.Literal)(index)]); // use `.apply` to fool automated de-obfuscators

      if ((0, _random.chance)(10)) {
        callExpr = (0, _gen.CallExpression)((0, _gen.MemberExpression)((0, _gen.Identifier)(fnName), (0, _gen.Literal)("apply"), true), [(0, _gen.Identifier)("undefined"), (0, _gen.ArrayExpression)([(0, _gen.Literal)(index)])]);
      } // use `.call`
      else if ((0, _random.chance)(10)) {
        callExpr = (0, _gen.CallExpression)((0, _gen.MemberExpression)((0, _gen.Identifier)(fnName), (0, _gen.Literal)("call"), true), [(0, _gen.Identifier)("undefined"), (0, _gen.Literal)(index)]);
      }

      var referenceType = "call";

      if (parents.length && (0, _random.chance)(50 - this.variablesMade)) {
        referenceType = "constantReference";
      }

      var newExpr = callExpr;

      if (referenceType === "constantReference") {
        // Define the string earlier, reference the name here
        this.variablesMade++;
        var constantReferenceType = (0, _random.choice)(["variable", "array", "object"]);
        var place = (0, _random.choice)(parents.filter(node => (0, _traverse.isBlock)(node)));

        if (!place) {
          this.error(new Error("No lexical block to insert code"));
        }

        switch (constantReferenceType) {
          case "variable":
            var name = this.getPlaceholder();
            (0, _insert.prepend)(place, (0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(name, callExpr)));
            newExpr = (0, _gen.Identifier)(name);
            break;

          case "array":
            if (!place.$stringConcealingArray) {
              place.$stringConcealingArray = (0, _gen.ArrayExpression)([]);
              place.$stringConcealingArrayName = this.getPlaceholder();
              (0, _insert.prepend)(place, (0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(place.$stringConcealingArrayName, place.$stringConcealingArray)));
            }

            var arrayIndex = place.$stringConcealingArray.elements.length;
            place.$stringConcealingArray.elements.push(callExpr);
            var memberExpression = (0, _gen.MemberExpression)((0, _gen.Identifier)(place.$stringConcealingArrayName), (0, _gen.Literal)(arrayIndex), true);
            newExpr = memberExpression;
            break;

          case "object":
            if (!place.$stringConcealingObject) {
              place.$stringConcealingObject = (0, _gen.ObjectExpression)([]);
              place.$stringConcealingObjectName = this.getPlaceholder();
              (0, _insert.prepend)(place, (0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(place.$stringConcealingObjectName, place.$stringConcealingObject)));
            }

            var propName = this.gen.generate();
            var property = (0, _gen.Property)((0, _gen.Literal)(propName), callExpr, true);
            place.$stringConcealingObject.properties.push(property);
            var memberExpression = (0, _gen.MemberExpression)((0, _gen.Identifier)(place.$stringConcealingObjectName), (0, _gen.Literal)(propName), true);
            newExpr = memberExpression;
            break;
        }
      }

      this.replaceIdentifierOrLiteral(object, newExpr, parents);
    };
  }

}

exports.default = StringConcealing;