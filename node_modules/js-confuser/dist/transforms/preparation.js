"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transform = _interopRequireDefault(require("./transform"));

var _gen = require("../util/gen");

var _order = require("../order");

var _insert = require("../util/insert");

var _identifiers = require("../util/identifiers");

var _compare = require("../util/compare");

var _traverse = require("../traverse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Preparation arranges the user's code into an AST the obfuscator can easily transform.
 *
 * ExplicitIdentifiers
 * - `object.IDENTIFIER` -> `object['IDENTIFIER']` // Now String Concealing can apply on it
 * - `{ IDENTIFIER: ... }` -> `{ "IDENTIFIER": ... }`
 *
 * ExplicitDeclarations
 * - `var a,b,c` -> `var a; var b; var c;` // Now Stack can apply on it
 *
 * Block
 * - `x => x * 2` -> `x => { return x * 2 }` // Change into Block Statements
 * - `if(true) return` -> `if (true) { return }`
 * - `while(a) a--;` -> `while(a) { a-- }`
 *
 * Label
 * - `for(...) { break; }` -> `_1: for(...) { break _1; }`
 * - `switch(v) { case 1...break }` -> `_2: switch(v) { case 1...break _2; }`
 * - // Control Flow Flattening can safely apply now
 */
class Preparation extends _transform.default {
  constructor(o) {
    super(o, _order.ObfuscateOrder.Preparation);
  }

  match(object, parents) {
    return !!object.type;
  }

  transform(object, parents) {
    // ExplicitIdentifiers
    if (object.type === "Identifier") {
      return this.transformExplicitIdentifiers(object, parents);
    } // ExplicitDeclarations


    if (object.type === "VariableDeclaration") {
      return this.transformExplicitDeclarations(object, parents);
    } // Block


    switch (object.type) {
      /**
       * People use shortcuts and its harder to parse.
       *
       * - `if (a) b()` -> `if (a) { b() }`
       * - Ensures all bodies are `BlockStatement`, not individual expression statements
       */
      case "IfStatement":
        if (object.consequent.type != "BlockStatement") {
          object.consequent = (0, _gen.BlockStatement)([(0, _insert.clone)(object.consequent)]);
        }

        if (object.alternate && object.alternate.type != "BlockStatement") {
          object.alternate = (0, _gen.BlockStatement)([(0, _insert.clone)(object.alternate)]);
        }

        break;

      case "WhileStatement":
      case "WithStatement":
      case "ForStatement":
      case "ForOfStatement":
      case "ForInStatement":
        if (object.body.type != "BlockStatement") {
          object.body = (0, _gen.BlockStatement)([(0, _insert.clone)(object.body)]);
        }

        break;

      case "ArrowFunctionExpression":
        if (object.body.type !== "BlockStatement" && object.expression) {
          object.body = (0, _gen.BlockStatement)([(0, _gen.ReturnStatement)((0, _insert.clone)(object.body))]);
          object.expression = false;
        }

        break;
    } // Label


    if ((0, _compare.isLoop)(object) || object.type == "BlockStatement" && parents[0] && parents[0].type == "LabeledStatement" && parents[0].body === object) {
      return this.transformLabel(object, parents);
    }
  }
  /**
   * Ensures every break; statement has a label to point to.
   *
   * This is because Control Flow Flattening adds For Loops which label-less break statements point to the nearest,
   * when they actually need to point to the original statement.
   */


  transformLabel(object, parents) {
    return () => {
      var currentLabel = parents[0].type == "LabeledStatement" && parents[0].label.name;
      var label = currentLabel || this.getPlaceholder();
      (0, _traverse.walk)(object, parents, (o, p) => {
        if (o.type == "BreakStatement" || o.type == "ContinueStatement") {
          function isContinuableStatement(x) {
            return (0, _compare.isLoop)(x) && x.type !== "SwitchStatement";
          }

          function isBreakableStatement(x) {
            return (0, _compare.isLoop)(x) || o.label && x.type == "BlockStatement";
          }

          var fn = o.type == "ContinueStatement" ? isContinuableStatement : isBreakableStatement;
          var loop = p.find(fn);

          if (object == loop) {
            if (!o.label) {
              o.label = (0, _gen.Identifier)(label);
            }
          }
        }
      }); // Append label statement as this loop has none

      if (!currentLabel) {
        this.replace(object, (0, _gen.LabeledStatement)(label, { ...object
        }));
      }
    };
  }
  /**
   * Transforms Identifiers (a.IDENTIFIER, {IDENTIFIER:...}) into string properties
   */


  transformExplicitIdentifiers(object, parents) {
    // Mark functions containing 'eval'
    // Some transformations avoid functions that have 'eval' to not break them
    if (object.name === "eval") {
      var fn = (0, _insert.getFunction)(object, parents);

      if (fn) {
        fn.$requiresEval = true;
      }
    }

    var info = (0, _identifiers.getIdentifierInfo)(object, parents);

    if (info.isPropertyKey || info.isAccessor) {
      var propIndex = parents.findIndex(x => x.type == "MethodDefinition" || x.type == "Property"); // Don't change constructor!

      if (propIndex !== -1) {
        if (parents[propIndex].type == "MethodDefinition" && parents[propIndex].kind == "constructor") {
          return;
        }
      }

      this.replace(object, (0, _gen.Literal)(object.name));
      parents[0].computed = true;
      parents[0].shorthand = false;
    }
  }
  /**
   * Transforms VariableDeclaration into single declarations.
   */


  transformExplicitDeclarations(object, parents) {
    // for ( var x in ... ) {...}
    var forIndex = parents.findIndex(x => x.type == "ForInStatement" || x.type == "ForOfStatement");

    if (forIndex != -1 && parents[forIndex].left == (parents[forIndex - 1] || object)) {
      object.declarations.forEach(x => {
        x.init = null;
      });
      return;
    }

    var body = parents[0];

    if ((0, _compare.isLoop)(body) || body.type == "LabeledStatement") {
      return;
    }

    if (body.type == "ExportNamedDeclaration") {
      return;
    }

    if (!Array.isArray(body)) {
      this.error(new Error("body is " + body.type));
    }

    if (object.declarations.length > 1) {
      // Make singular
      var index = body.indexOf(object);

      if (index == -1) {
        this.error(new Error("index is -1"));
      }

      var after = object.declarations.slice(1);
      body.splice(index + 1, 0, ...after.map(x => {
        return {
          type: "VariableDeclaration",
          declarations: [(0, _insert.clone)(x)],
          kind: object.kind
        };
      }));
      object.declarations.length = 1;
    }
  }

}

exports.default = Preparation;