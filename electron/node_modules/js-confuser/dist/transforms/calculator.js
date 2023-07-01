"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transform = _interopRequireDefault(require("./transform"));

var _gen = require("../util/gen");

var _insert = require("../util/insert");

var _random = require("../util/random");

var _order = require("../order");

var _assert = require("assert");

var _precedence = require("../precedence");

var _template = _interopRequireDefault(require("../templates/template"));

var _probability = require("../probability");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const allowedBinaryOperators = new Set(["+", "-", "*", "/"]);
const allowedUnaryOperators = new Set(["!", "void", "typeof", "-", "~", "+"]);

class Calculator extends _transform.default {
  constructor(o) {
    super(o, _order.ObfuscateOrder.Calculator);

    _defineProperty(this, "gen", void 0);

    _defineProperty(this, "ops", void 0);

    _defineProperty(this, "statesUsed", void 0);

    _defineProperty(this, "calculatorFn", void 0);

    _defineProperty(this, "calculatorOpVar", void 0);

    _defineProperty(this, "calculatorSetOpFn", void 0);

    this.ops = Object.create(null);
    this.statesUsed = new Set();
    this.calculatorFn = this.getPlaceholder() + "_calc";
    this.calculatorOpVar = this.getPlaceholder();
    this.calculatorSetOpFn = this.getPlaceholder();
    this.gen = this.getGenerator();
  }

  apply(tree) {
    super.apply(tree);

    if (Object.keys(this.ops).length == 0) {
      return;
    }

    var leftArg = this.getPlaceholder();
    var rightArg = this.getPlaceholder();
    var switchCases = [];
    Object.keys(this.ops).forEach(opKey => {
      var [type, operator] = opKey.split("_");
      var code = this.ops[opKey];
      var body = [];

      if (type === "Binary") {
        body = [(0, _gen.ReturnStatement)((0, _gen.BinaryExpression)(operator, (0, _gen.Identifier)(leftArg), (0, _gen.Identifier)(rightArg)))];
      } else if (type === "Unary") {
        body = [(0, _gen.ReturnStatement)((0, _gen.UnaryExpression)(operator, (0, _gen.Identifier)(leftArg)))];
      } else {
        throw new Error("Unknown type: " + type);
      }

      switchCases.push((0, _gen.SwitchCase)((0, _gen.Literal)(code), body));
    });
    var func = (0, _gen.FunctionDeclaration)(this.calculatorFn, [leftArg, rightArg].map(x => (0, _gen.Identifier)(x)), [(0, _gen.SwitchStatement)((0, _gen.Identifier)(this.calculatorOpVar), switchCases)]);
    (0, _insert.prepend)(tree, (0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(this.calculatorOpVar)));
    (0, _insert.prepend)(tree, (0, _template.default)("function {name}(a){\n        a = {b} + ({b}=a, 0);\n        return a;\n      }").single({
      name: this.calculatorSetOpFn,
      b: this.calculatorOpVar
    }));
    (0, _insert.prepend)(tree, func);
  }

  match(object, parents) {
    return object.type === "BinaryExpression" || object.type === "UnaryExpression";
  }

  transform(object, parents) {
    // Allow percentage
    if (!(0, _probability.ComputeProbabilityMap)(this.options.calculator)) {
      return;
    }

    var operator = object.operator;
    var type;

    if (object.type === "BinaryExpression") {
      type = "Binary";

      if (!allowedBinaryOperators.has(operator)) {
        return;
      } // Additional checks to ensure complex expressions still work


      var myPrecedence = _precedence.OPERATOR_PRECEDENCE[operator] + Object.keys(_precedence.OPERATOR_PRECEDENCE).indexOf(operator) / 100;
      var precedences = parents.map(x => x.type == "BinaryExpression" && _precedence.OPERATOR_PRECEDENCE[x.operator] + Object.keys(_precedence.OPERATOR_PRECEDENCE).indexOf(x.operator) / 100); // corrupt AST

      if (precedences.find(x => x >= myPrecedence)) {
        return;
      }

      if (parents.find(x => x.$dispatcherSkip || x.type == "BinaryExpression")) {
        return;
      }
    }

    if (object.type === "UnaryExpression") {
      type = "Unary";

      if (!allowedUnaryOperators.has(operator)) {
        return;
      } // Typeof expression fix


      if (operator === "typeof" && object.argument.type === "Identifier") {
        // `typeof name` is special because it can reference the variable `name` without
        // throwing any errors. If changed, an error could be thrown, breaking the users code
        return;
      }
    }

    return () => {
      const opKey = type + "_" + operator;

      if (typeof this.ops[opKey] !== "number") {
        var newState;

        do {
          newState = (0, _random.getRandomInteger)(-50, 50 + Object.keys(this.ops).length * 5);
        } while (this.statesUsed.has(newState));

        (0, _assert.ok)(!isNaN(newState));
        this.statesUsed.add(newState);
        this.ops[opKey] = newState;

        if (type === "Binary") {
          this.log("left ".concat(operator, " right ->"), "".concat(this.calculatorFn, "((").concat(newState, ", left, right)"));
        } else if (type === "Unary") {
          this.log("".concat(operator, "(argument) ->"), "".concat(this.calculatorFn, "(").concat(newState, ", argument)"));
        }
      } // The operator expression sets the operator to be used


      var operatorExpression = (0, _random.choice)([(0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)(this.calculatorOpVar), (0, _gen.Literal)(this.ops[opKey])), (0, _gen.CallExpression)((0, _gen.Identifier)(this.calculatorSetOpFn), [(0, _gen.Literal)(this.ops[opKey])])]);
      var newExpression;

      if (type === "Binary") {
        newExpression = (0, _gen.CallExpression)((0, _gen.Identifier)(this.calculatorFn), [object.left, object.right, operatorExpression]);
      } else {
        newExpression = (0, _gen.CallExpression)((0, _gen.Identifier)(this.calculatorFn), [object.argument, operatorExpression]);
      }

      this.replace(object, newExpression);
    };
  }

}

exports.default = Calculator;