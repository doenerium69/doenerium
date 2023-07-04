"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AntiArrowFunction = void 0;

var _transform = _interopRequireDefault(require("../transform"));

var _gen = require("../../util/gen");

var _insert = require("../../util/insert");

var _traverse = require("../../traverse");

var _order = require("../../order");

var _assert = require("assert");

var _constants = require("../../constants");

var _antiDestructuring = _interopRequireDefault(require("./antiDestructuring"));

var _antiTemplate = _interopRequireDefault(require("./antiTemplate"));

var _antiClass = _interopRequireDefault(require("./antiClass"));

var _antiES6Object = _interopRequireDefault(require("./antiES6Object"));

var _antiSpreadOperator = _interopRequireDefault(require("./antiSpreadOperator"));

var _es = require("../../templates/es5");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `Const` and `Let` are not allowed in ES5.
 */
class AntiConstLet extends _transform.default {
  constructor(o) {
    super(o);
  }

  match(object, parents) {
    return object.type == "VariableDeclaration" && object.kind != "var";
  }

  transform(object) {
    object.kind = "var";
  }

}
/**
 * Converts arrow functions
 */


class AntiArrowFunction extends _transform.default {
  constructor(o) {
    super(o);
  }

  match(object, parents) {
    return object.type == "ArrowFunctionExpression";
  }

  transform(object, parents) {
    return () => {
      var usesThis = false;

      if (object.body.type != "BlockStatement" && object.expression) {
        object.body = (0, _gen.BlockStatement)([(0, _gen.ReturnStatement)((0, _insert.clone)(object.body))]);
        object.expression = false;
      }

      (0, _traverse.walk)(object.body, [object, ...parents], (o, p) => {
        if (p.filter(x => (0, _traverse.isBlock)(x))[0] == object.body) {
          if (o.type == "ThisExpression" || o.type == "Identifier" && o.name == "this") {
            usesThis = true;
          }
        }
      });
      (0, _assert.ok)(object.body.type == "BlockStatement", "Should be a BlockStatement");
      (0, _assert.ok)(Array.isArray(object.body.body), "Body should be an array");
      (0, _assert.ok)(!object.body.body.find(x => Array.isArray(x)), "All elements should be statements");
      object.type = "FunctionExpression";
      object.expression = false;

      if (usesThis) {
        this.objectAssign(object, (0, _gen.CallExpression)((0, _gen.MemberExpression)((0, _insert.clone)(object), (0, _gen.Identifier)("bind"), false), [(0, _gen.ThisExpression)()]));
      }
    };
  }

}
/**
 * The ES5 options aims to convert ES6 and up features down to ES5-compatible code.
 *
 * The obfuscator regularly adds ES6 code (variable destructuring, spread element, etc.)
 * This transformations goal is undo only these things.
 */


exports.AntiArrowFunction = AntiArrowFunction;

class ES5 extends _transform.default {
  constructor(o) {
    super(o, _order.ObfuscateOrder.ES5);
    this.before.push(new _antiClass.default(o));
    this.before.push(new _antiTemplate.default(o));
    this.before.push(new _antiSpreadOperator.default(o));
    this.before.push(new _antiES6Object.default(o));
    this.before.push(new AntiArrowFunction(o));
    this.before.push(new _antiDestructuring.default(o));
    this.before.push(new AntiConstLet(o));
  }

  apply(tree) {
    super.apply(tree);

    var nodesToAdd = _es.ES5Template.compile();

    (0, _insert.prepend)(tree, ...nodesToAdd);
  } // FixedExpressions


  match(object, parents) {
    return !!object.type;
  }

  transform(object, parents) {
    return () => {
      // Object.keyword -> Object["keyword"]
      if (object.type == "MemberExpression") {
        if (!object.computed && object.property.type == "Identifier") {
          if (_constants.reservedKeywords.has(object.property.name)) {
            object.property = (0, _gen.Literal)(object.property.name);
            object.computed = true;
          }
        }
      } // { keyword: ... } -> { "keyword": ... }


      if (object.type == "Property") {
        if (!object.computed && object.key.type == "Identifier") {
          if (_constants.reservedKeywords.has(object.key.name)) {
            object.key = (0, _gen.Literal)(object.key.name);
          }
        }
      }
    };
  }

}

exports.default = ES5;