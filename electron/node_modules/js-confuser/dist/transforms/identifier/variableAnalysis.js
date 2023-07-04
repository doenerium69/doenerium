"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("assert");

var _constants = require("../../constants");

var _compare = require("../../util/compare");

var _identifiers = require("../../util/identifiers");

var _insert = require("../../util/insert");

var _transform = _interopRequireDefault(require("../transform"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Keeps track of what identifiers are defined and referenced in each context.
 */
class VariableAnalysis extends _transform.default {
  /**
   * Node being the context.
   */

  /**
   * Context->Nodes referenced (does not include nested)
   */

  /**
   * Set of global identifiers to never be redefined
   *
   * - Used to not accidentally block access to a global variable
   */

  /**
   * Set of identifiers that are defined within the program
   */
  constructor(o) {
    super(o);

    _defineProperty(this, "defined", void 0);

    _defineProperty(this, "references", void 0);

    _defineProperty(this, "globals", void 0);

    _defineProperty(this, "notGlobals", void 0);

    this.defined = new Map();
    this.references = new Map();
    this.globals = new Set();
    this.notGlobals = new Set();
  }

  match(object, parents) {
    return object.type === "Identifier";
  }

  transform(object, parents) {
    var name = object.name;
    (0, _assert.ok)(typeof name === "string");

    if (!(0, _compare.isValidIdentifier)(name)) {
      return;
    }

    if (_constants.reservedIdentifiers.has(name)) {
      return;
    }

    if (this.options.globalVariables.has(name)) {
      return;
    }

    var info = (0, _identifiers.getIdentifierInfo)(object, parents);

    if (!info.spec.isReferenced) {
      return;
    }

    if (info.spec.isExported) {
      return;
    }

    var isDefined = info.spec.isDefined; // Keep track of defined names within the program

    if (isDefined) {
      this.notGlobals.add(object.name);
      this.globals.delete(object.name);
    } else if (!this.notGlobals.has(object.name)) {
      this.globals.add(object.name);
    }

    var definingContexts = info.spec.isDefined ? (0, _insert.getAllDefiningContexts)(object, parents) : (0, _insert.getReferencingContexts)(object, parents, info);
    (0, _assert.ok)(definingContexts.length);
    definingContexts.forEach(definingContext => {
      // ok(
      //   isContext(definingContext),
      //   `${definingContext.type} is not a context`
      // );
      if (isDefined) {
        // Add to defined Map
        if (!this.defined.has(definingContext)) {
          this.defined.set(definingContext, new Set());
        }

        this.defined.get(definingContext).add(name);
        this.references.has(definingContext) && this.references.get(definingContext).delete(name);
      } else {
        // Add to references Map
        if (!this.defined.has(definingContext) || !this.defined.get(definingContext).has(name)) {
          if (!this.references.has(definingContext)) {
            this.references.set(definingContext, new Set());
          }

          this.references.get(definingContext).add(name);
        }
      }
    });
  }

}

exports.default = VariableAnalysis;