"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../../constants");

var _identifiers = require("../../util/identifiers");

var _transform = _interopRequireDefault(require("../transform"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Global Analysis is responsible for finding all the global variables used in the code.
 *
 * A 'global variable' is one that is:
 * - Referenced
 * - Never defined or overridden
 */
class GlobalAnalysis extends _transform.default {
  constructor(o) {
    super(o);

    _defineProperty(this, "notGlobals", void 0);

    _defineProperty(this, "globals", void 0);

    this.globals = Object.create(null);
    this.notGlobals = new Set();
  }

  match(object, parents) {
    return object.type == "Identifier" && !_constants.reservedKeywords.has(object.name);
  }

  transform(object, parents) {
    // no touching `import()` or `import x from ...`
    var importIndex = parents.findIndex(x => x.type == "ImportExpression" || x.type == "ImportDeclaration");

    if (importIndex !== -1) {
      if (parents[importIndex].source === (parents[importIndex - 1] || object)) {
        return;
      }
    }

    var info = (0, _identifiers.getIdentifierInfo)(object, parents);

    if (!info.spec.isReferenced) {
      return;
    } // Cannot be defined or overridden


    if (info.spec.isDefined || info.spec.isModified) {
      delete this.globals[object.name];
      this.notGlobals.add(object.name);
      return;
    } // Add to globals


    if (!this.notGlobals.has(object.name)) {
      if (!this.globals[object.name]) {
        this.globals[object.name] = [];
      }

      this.globals[object.name].push([object, parents]);
    }

    var assignmentIndex = parents.findIndex(x => x.type == "AssignmentExpression");
    var updateIndex = parents.findIndex(x => x.type == "UpdateExpression");

    if (assignmentIndex != -1 && parents[assignmentIndex].left === (parents[assignmentIndex - 1] || object) || updateIndex != -1) {
      var memberIndex = parents.findIndex(x => x.type == "MemberExpression");

      if (memberIndex == -1 || memberIndex > (assignmentIndex == -1 ? assignmentIndex : updateIndex)) {
        delete this.globals[object.name];
        this.notGlobals.add(object.name);
      }
    }
  }

}

exports.default = GlobalAnalysis;