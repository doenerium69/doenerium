"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = require("assert");

var _order = require("../../order");

var _probability = require("../../probability");

var _template = _interopRequireDefault(require("../../templates/template"));

var _traverse = require("../../traverse");

var _gen = require("../../util/gen");

var _identifiers = require("../../util/identifiers");

var _insert = require("../../util/insert");

var _random = require("../../util/random");

var _transform = _interopRequireDefault(require("../transform"));

var _expressionObfuscation = _interopRequireDefault(require("./expressionObfuscation"));

var _stringConcealing = require("../string/stringConcealing");

var _constants = require("../../constants");

var _compare = require("../../util/compare");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const flattenStructures = new Set(["IfStatement", "ForStatement", "WhileStatement", "DoWhileStatement"]);
/**
 * A chunk represents a small segment of code
 */

/**
 * Breaks functions into DAGs (Directed Acyclic Graphs)
 *
 * - 1. Break functions into chunks
 * - 2. Shuffle chunks but remember their original position
 * - 3. Create a Switch statement inside a While loop, each case is a chunk, and the while loops exits on the last transition.
 *
 * The Switch statement:
 *
 * - 1. The state variable controls which case will run next
 * - 2. At the end of each case, the state variable is updated to the next block of code.
 * - 3. The while loop continues until the the state variable is the end state.
 */
class ControlFlowFlattening extends _transform.default {
  // in Debug mode, the output is much easier to read
  // Flatten if-statements, for-loops, etc
  // var control = { str1, num1 }
  // 50 => state + X
  // true => state == X
  // console => (state == X ? console : _)
  // Tries to outline entire chunks
  // Tries to outline expressions found in chunks
  // case s != 49 && s - 10:
  // case 100: case 490: case 510: ...
  // add fakes chunks of code
  // predicate ? REAL : FAKE
  // s=NEXT_STATE,flag=true,break
  // Limit amount of mangling
  // Amount of blocks changed by Control Flow Flattening
  constructor(o) {
    super(o, _order.ObfuscateOrder.ControlFlowFlattening);

    _defineProperty(this, "isDebug", false);

    _defineProperty(this, "flattenControlStructures", true);

    _defineProperty(this, "addToControlObject", true);

    _defineProperty(this, "mangleNumberLiterals", true);

    _defineProperty(this, "mangleBooleanLiterals", true);

    _defineProperty(this, "mangleIdentifiers", true);

    _defineProperty(this, "outlineStatements", true);

    _defineProperty(this, "outlineExpressions", true);

    _defineProperty(this, "addComplexTest", true);

    _defineProperty(this, "addFakeTest", true);

    _defineProperty(this, "addDeadCode", true);

    _defineProperty(this, "addOpaquePredicates", true);

    _defineProperty(this, "addFlaggedLabels", true);

    _defineProperty(this, "mangledExpressionsMade", 0);

    _defineProperty(this, "cffCount", 0);

    if (!this.isDebug) {
      this.before.push(new _expressionObfuscation.default(o));
    } else {
      console.warn("Debug mode enabled");
    }
  }

  match(object, parents) {
    return (0, _traverse.isBlock)(object) && (!parents[0] || !flattenStructures.has(parents[0].type)) && (!parents[1] || !flattenStructures.has(parents[1].type));
  }

  transform(object, parents) {
    var _this = this;

    // Must be at least 3 statements or more
    if (object.body.length < 3) {
      return;
    } // No 'let'/'const' allowed (These won't work in Switch cases!)


    if ((0, _identifiers.containsLexicallyBoundVariables)(object, parents)) {
      return;
    } // Check user's threshold setting


    if (!(0, _probability.ComputeProbabilityMap)(this.options.controlFlowFlattening, x => x)) {
      return;
    }

    var objectBody = (0, _insert.getBlockBody)(object.body);

    if (!objectBody.length) {
      return;
    } // Purely for naming purposes


    var cffIndex = this.cffCount++; // The controlVar is an object containing:
    // - Strings found in chunks
    // - Numbers found in chunks
    // - Helper functions to adjust the state
    // - Outlined expressions changed into functions

    var controlVar = this.getPlaceholder() + "_c".concat(cffIndex, "_CONTROL");
    var controlProperties = [];
    var controlConstantMap = new Map();
    var controlGen = this.getGenerator("mangled");
    var controlTestKey = controlGen.generate(); // This 'controlVar' can be accessed by child-nodes

    object.$controlVar = controlVar;
    object.$controlConstantMap = controlConstantMap;
    object.$controlProperties = controlProperties;
    object.$controlGen = controlGen;
    return () => {
      (0, _assert.ok)(Array.isArray(objectBody)); // The state variable names (and quantity)

      var stateVars = Array(this.isDebug ? 1 : (0, _random.getRandomInteger)(2, 5)).fill(0).map((_, i) => this.getPlaceholder() + "_c".concat(cffIndex, "_S").concat(i)); // How often should chunks be split up?
      // Percentage between 10% and 90% based on block size

      var splitPercent = Math.max(10, 90 - objectBody.length * 5); // Find functions and import declarations

      var importDeclarations = [];
      var functionDeclarationNames = new Set();
      var functionDeclarationValues = new Map(); // Find all parent control-nodes

      const allControlNodes = [object];
      parents.filter(x => x.$controlVar).forEach(node => allControlNodes.push(node));

      const addControlMapConstant = literalValue => {
        var _selectedControlConst;

        // Choose a random control node to add to
        var controlNode = (0, _random.choice)(allControlNodes);
        var selectedControlVar = controlNode.$controlVar;
        var selectedControlConstantMap = controlNode.$controlConstantMap;
        var selectedControlProperties = controlNode.$controlProperties;
        var key = (_selectedControlConst = selectedControlConstantMap.get(literalValue)) === null || _selectedControlConst === void 0 ? void 0 : _selectedControlConst.key; // Not found, create

        if (!key) {
          key = controlNode.$controlGen.generate();
          selectedControlConstantMap.set(literalValue, {
            key: key
          });
          selectedControlProperties.push((0, _gen.Property)((0, _gen.Literal)(key), (0, _gen.Literal)(literalValue), false));
        }

        return getControlMember(key, selectedControlVar);
      }; // Helper function to easily make control object accessors


      const getControlMember = function (key) {
        let objectName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : controlVar;
        return (0, _gen.MemberExpression)((0, _gen.Identifier)(objectName), (0, _gen.Literal)(key), true);
      }; // This function recursively calls itself to flatten and split up code into 'chunks'


      const flattenBody = (body, startingLabel) => {
        var chunks = [];
        var currentBody = [];
        var currentLabel = startingLabel; // This function ends the current chunk being created ('currentBody')

        const finishCurrentChunk = function (pointingLabel, newLabel) {
          let addGotoStatement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

          if (!newLabel) {
            newLabel = _this.getPlaceholder();
          }

          if (!pointingLabel) {
            pointingLabel = newLabel;
          }

          if (addGotoStatement) {
            currentBody.push({
              type: "GotoStatement",
              label: pointingLabel
            });
          }

          chunks.push({
            label: currentLabel,
            body: [...currentBody]
          }); // Random chance of this chunk being flagged (First label cannot be flagged)

          if (!_this.isDebug && _this.addFlaggedLabels && currentLabel !== startLabel && (0, _random.chance)(25)) {
            flaggedLabels[currentLabel] = {
              flagKey: controlGen.generate(),
              flagValue: (0, _random.choice)([true, false])
            };
          }

          (0, _traverse.walk)(currentBody, [], (o, p) => {
            if (o.type === "Literal" && !_this.isDebug) {
              // Add strings to the control object
              if (_this.addToControlObject && typeof o.value === "string" && o.value.length >= 3 && o.value.length <= 100 && !(0, _stringConcealing.isModuleSource)(o, p) && !(0, _compare.isDirective)(o, p) && !o.regex && (0, _random.chance)(50 - controlConstantMap.size - _this.mangledExpressionsMade / 100)) {
                return () => {
                  _this.replaceIdentifierOrLiteral(o, addControlMapConstant(o.value), p);
                };
              } // Add numbers to the control object


              if (_this.addToControlObject && typeof o.value === "number" && Math.floor(o.value) === o.value && Math.abs(o.value) < 100000 && (0, _random.chance)(50 - controlConstantMap.size - _this.mangledExpressionsMade / 100)) {
                return () => {
                  _this.replaceIdentifierOrLiteral(o, addControlMapConstant(o.value), p);
                };
              }
            }
          });
          currentLabel = newLabel;
          currentBody = [];
        };

        if (body !== objectBody) {
          // This code is nested. Move function declarations up
          var newBody = [];

          for (var stmt of body) {
            if (stmt.type === "FunctionDeclaration") {
              newBody.unshift(stmt);
            } else {
              newBody.push(stmt);
            }
          }

          body = newBody;
        }

        body.forEach((stmt, i) => {
          if (stmt.type === "ImportDeclaration") {
            // The 'importDeclarations' hold statements that are required to be left untouched at the top of the block
            importDeclarations.push(stmt);
            return;
          } else if (stmt.type === "FunctionDeclaration") {
            var functionName = stmt.id.name;
            stmt.type = "FunctionExpression";
            stmt.id = null;
            functionDeclarationNames.add(functionName);

            if (objectBody === body) {
              functionDeclarationValues.set(functionName, stmt);
              return;
            } else {
              currentBody.push((0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)(functionName), stmt)));
            }

            return;
          } else if (stmt.directive) {
            if (objectBody === body) {
              importDeclarations.push(stmt);
            } else {
              this.error(new Error("Unimplemented directive support."));
            }

            return;
          }

          if (stmt.type == "GotoStatement" && i !== body.length - 1) {
            finishCurrentChunk(stmt.label);
            return;
          } // The Preparation transform adds labels to every Control-Flow node


          if (this.flattenControlStructures && stmt.type == "LabeledStatement") {
            var lbl = stmt.label.name;
            var control = stmt.body;
            var isSwitchStatement = control.type === "SwitchStatement";

            if (isSwitchStatement || (control.type == "ForStatement" || control.type == "WhileStatement" || control.type == "DoWhileStatement") && control.body.type == "BlockStatement") {
              if (isSwitchStatement) {
                if (control.cases.length == 0) {
                  currentBody.push(stmt);
                  return;
                }
              }

              var isLoop = !isSwitchStatement;
              var supportContinueStatement = isLoop;
              var testPath = this.getPlaceholder();
              var updatePath = this.getPlaceholder();
              var bodyPath = this.getPlaceholder();
              var afterPath = this.getPlaceholder();
              var possible = true;
              var toReplace = []; // Find all break; and continue; statements and change them into 'GotoStatement's

              (0, _traverse.walk)(control.body || control.cases, [], (o, p) => {
                if (o.type === "BreakStatement" || o.type === "ContinueStatement") {
                  var allowedLabels = new Set(p.filter(x => x.type === "LabeledStatement" && x.body.type === "SwitchStatement").map(x => x.label.name));
                  var isUnsupportedContinue = !supportContinueStatement && o.type === "ContinueStatement";
                  var isInvalidLabel = !o.label || o.label.name !== lbl && !allowedLabels.has(o.label.name); // This seems like the best solution:

                  if (isUnsupportedContinue || isInvalidLabel) {
                    possible = false;
                    return "EXIT";
                  }

                  if (o.label.name === lbl) {
                    return () => {
                      toReplace.push([o, {
                        type: "GotoStatement",
                        label: o.type == "BreakStatement" ? afterPath : updatePath
                      }]);
                    };
                  }
                }
              });

              if (!possible) {
                currentBody.push(stmt);
                return;
              }

              toReplace.forEach(v => this.replace(v[0], v[1]));

              if (isSwitchStatement) {
                var switchDiscriminantName = this.getPlaceholder() + "_switchD"; // Stores the value of the discriminant

                var switchTestName = this.getPlaceholder() + "_switchT"; // Set to true when a Switch case is matched

                currentBody.push((0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(switchDiscriminantName, control.discriminant)));
                currentBody.push((0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(switchTestName, (0, _gen.Literal)(false)))); // case labels are:
                // `${caseLabelPrefix}_test_${index}`
                // `${caseLabelPrefix}_entry_${index}`

                var caseLabelPrefix = this.getPlaceholder();
                var defaultCaseIndex = control.cases.findIndex(x => x.test === null);
                control.cases.forEach((switchCase, i) => {
                  var testPath = caseLabelPrefix + "_test_" + i;
                  var entryPath = caseLabelPrefix + "_entry_" + i;
                  var nextEntryPath = i === control.cases.length - 1 // Last path goes to afterPath
                  ? afterPath // Else go to next entry path (fall-through behavior)
                  : caseLabelPrefix + "_entry_" + (i + 1);
                  var nextTestPath = i === control.cases.length - 1 ? afterPath : caseLabelPrefix + "_test_" + (i + 1);
                  finishCurrentChunk(testPath, testPath, i == 0);

                  if (switchCase.test) {
                    // Check the case condition and goto statement
                    currentBody.push((0, _gen.IfStatement)((0, _gen.BinaryExpression)("===", (0, _gen.Identifier)(switchDiscriminantName), switchCase.test), [(0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)(switchTestName), (0, _gen.Literal)(true))), {
                      type: "GotoStatement",
                      label: entryPath
                    }]));
                  } else {// Default case: No test needed.
                  } // If default case, on last test, if no case was matched, goto default case


                  if (i === control.cases.length - 1 && defaultCaseIndex !== -1) {
                    currentBody.push((0, _gen.IfStatement)((0, _gen.UnaryExpression)("!", (0, _gen.Identifier)(switchTestName)), [{
                      type: "GotoStatement",
                      label: caseLabelPrefix + "_entry_" + defaultCaseIndex
                    }]));
                  } // Jump to next test


                  currentBody.push({
                    type: "GotoStatement",
                    label: nextTestPath
                  });
                  chunks.push(...flattenBody([...switchCase.consequent, {
                    type: "GotoStatement",
                    label: nextEntryPath
                  }], entryPath));
                });
                finishCurrentChunk(afterPath, afterPath, false);
                return;
              } else if (isLoop) {
                var isPostTest = control.type == "DoWhileStatement"; // add initializing section to current chunk

                if (control.init) {
                  if (control.init.type == "VariableDeclaration") {
                    currentBody.push(control.init);
                  } else {
                    currentBody.push((0, _gen.ExpressionStatement)(control.init));
                  }
                } // create new label called `testPath` and have current chunk point to it (goto testPath)


                finishCurrentChunk(isPostTest ? bodyPath : testPath, testPath);
                currentBody.push((0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", getControlMember(controlTestKey), control.test || (0, _gen.Literal)(true))));
                finishCurrentChunk();
                currentBody.push((0, _gen.IfStatement)(getControlMember(controlTestKey), [{
                  type: "GotoStatement",
                  label: bodyPath
                }])); // create new label called `bodyPath` and have test body point to afterPath (goto afterPath)

                finishCurrentChunk(afterPath, bodyPath);
                var innerBothPath = this.getPlaceholder();
                chunks.push(...flattenBody([...control.body.body, {
                  type: "GotoStatement",
                  label: updatePath
                }], innerBothPath));
                finishCurrentChunk(innerBothPath, updatePath);

                if (control.update) {
                  currentBody.push((0, _gen.ExpressionStatement)(control.update));
                }

                finishCurrentChunk(testPath, afterPath);
                return;
              }
            }
          }

          if (this.flattenControlStructures && stmt.type == "IfStatement" && stmt.consequent.type == "BlockStatement" && (!stmt.alternate || stmt.alternate.type == "BlockStatement")) {
            finishCurrentChunk();
            currentBody.push((0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", getControlMember(controlTestKey), stmt.test)));
            finishCurrentChunk();
            var hasAlternate = !!stmt.alternate;
            (0, _assert.ok)(!(hasAlternate && stmt.alternate.type !== "BlockStatement"));
            var yesPath = this.getPlaceholder();
            var noPath = this.getPlaceholder();
            var afterPath = this.getPlaceholder();
            currentBody.push((0, _gen.IfStatement)(getControlMember(controlTestKey), [{
              type: "GotoStatement",
              label: yesPath
            }]));
            chunks.push(...flattenBody([...stmt.consequent.body, {
              type: "GotoStatement",
              label: afterPath
            }], yesPath));

            if (hasAlternate) {
              chunks.push(...flattenBody([...stmt.alternate.body, {
                type: "GotoStatement",
                label: afterPath
              }], noPath));
              finishCurrentChunk(noPath, afterPath);
            } else {
              finishCurrentChunk(afterPath, afterPath);
            }

            return;
          }

          if (!currentBody.length || !(0, _random.chance)(splitPercent)) {
            currentBody.push(stmt);
          } else {
            // Start new chunk
            finishCurrentChunk();
            currentBody.push(stmt);
          }
        });
        finishCurrentChunk();
        chunks[chunks.length - 1].body.pop();
        return chunks;
      };
      /**
       * Executable code segments are broken down into `chunks` typically 1-3 statements each
       *
       * Chunked Code has a special `GotoStatement` node that get processed later on
       * This allows more complex control structures like `IfStatement`s and `ForStatement`s to be converted into basic
       * conditional jumps and flattened in the switch body
       *
       * IfStatement would be converted like this:
       *
       * MAIN:
       * if ( TEST ) {
       *    GOTO consequent_label;
       * } else? {
       *    GOTO alternate_label;
       * }
       * GOTO NEXT_CHUNK;
       */


      const chunks = []; // Flagged labels have addition code protecting the control state

      const flaggedLabels = Object.create(null);
      /**
       * label: switch(a+b+c){...break label...}
       */

      const switchLabel = this.getPlaceholder();
      const startLabel = this.getPlaceholder();
      chunks.push(...flattenBody(objectBody, startLabel));
      chunks[chunks.length - 1].body.push({
        type: "GotoStatement",
        label: "END_LABEL"
      });
      chunks.push({
        label: "END_LABEL",
        body: []
      });
      const endLabel = chunks[Object.keys(chunks).length - 1].label;

      if (!this.isDebug && this.addDeadCode) {
        // DEAD CODE 1/3: Add fake chunks that are never reached
        var fakeChunkCount = (0, _random.getRandomInteger)(1, 5);

        for (var i = 0; i < fakeChunkCount; i++) {
          // These chunks just jump somewhere random, they are never executed
          // so it could contain any code
          var fakeChunkBody = [// This a fake assignment expression
          (0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)((0, _random.choice)(stateVars)), (0, _gen.Literal)((0, _random.getRandomInteger)(-150, 150)))), {
            type: "GotoStatement",
            label: (0, _random.choice)(chunks).label
          }];
          chunks.push({
            label: this.getPlaceholder(),
            body: fakeChunkBody,
            impossible: true
          });
        } // DEAD CODE 2/3: Add fake jumps to really mess with deobfuscators


        chunks.forEach(chunk => {
          if ((0, _random.chance)(25)) {
            var randomLabel = (0, _random.choice)(chunks).label; // The `false` literal will be mangled

            chunk.body.unshift((0, _gen.IfStatement)((0, _gen.Literal)(false), [{
              type: "GotoStatement",
              label: randomLabel,
              impossible: true
            }]));
          }
        }); // DEAD CODE 3/3: Clone chunks but these chunks are never ran

        var cloneChunkCount = (0, _random.getRandomInteger)(1, 5);

        for (var i = 0; i < cloneChunkCount; i++) {
          var randomChunk = (0, _random.choice)(chunks);
          var clonedChunk = {
            body: (0, _insert.clone)(randomChunk.body),
            label: this.getPlaceholder(),
            impossible: true
          }; // Don't double define functions

          var hasDeclaration = clonedChunk.body.find(stmt => {
            return stmt.type === "FunctionDeclaration" || stmt.type === "ClassDeclaration";
          });

          if (!hasDeclaration) {
            chunks.unshift(clonedChunk);
          }
        }
      } // Generate a unique 'state' number for each chunk


      var caseSelection = new Set();
      var uniqueStatesNeeded = chunks.length;

      do {
        var newState = (0, _random.getRandomInteger)(1, chunks.length * 15);

        if (this.isDebug) {
          newState = caseSelection.size;
        }

        caseSelection.add(newState);
      } while (caseSelection.size !== uniqueStatesNeeded);

      (0, _assert.ok)(caseSelection.size == uniqueStatesNeeded);
      /**
       * The accumulated state values
       *
       * index -> total state value
       */

      var caseStates = Array.from(caseSelection);
      /**
       * The individual state values for each label
       *
       * labels right now are just chunk indexes (numbers)
       *
       * but will expand to if statements and functions when `goto statement` obfuscation is added
       */

      var labelToStates = Object.create(null);
      var lastLabel;
      Object.values(chunks).forEach((chunk, i) => {
        var state = caseStates[i];
        var stateValues = Array(stateVars.length).fill(0).map((_, i) => lastLabel && (0, _random.chance)(95) // Try to make state changes not as drastic (If last label, re-use some of it's values)
        ? labelToStates[lastLabel][i] : (0, _random.getRandomInteger)(-500, 500));

        const getCurrentState = () => {
          return stateValues.reduce((a, b) => b + a, 0);
        };

        var correctIndex = (0, _random.getRandomInteger)(0, stateValues.length);
        stateValues[correctIndex] = state - (getCurrentState() - stateValues[correctIndex]);
        labelToStates[chunk.label] = stateValues;
        lastLabel = chunk.label;
      });
      var initStateValues = [...labelToStates[startLabel]];
      var endState = labelToStates[endLabel].reduce((a, b) => b + a, 0); // Creates a predicate based on the state-variables and control-object properties

      const createPredicate = stateValues => {
        this.mangledExpressionsMade++;
        var index = (0, _random.getRandomInteger)(0, stateVars.length);
        var compareValue = (0, _random.choice)([stateValues[index], (0, _random.getRandomInteger)(-100, 100)]); // 'state equality' test

        var test = (0, _gen.BinaryExpression)("==", (0, _gen.Identifier)(stateVars[index]), createStateBoundNumberLiteral(compareValue, stateValues));
        var testValue = stateValues[index] === compareValue; // 'control' equality test

        if (controlConstantMap.size && (0, _random.chance)(50)) {
          var _controlConstantMap$g;

          // The controlMap maps LITERAL-values to STRING property names
          var actualValue = (0, _random.choice)(Array.from(controlConstantMap.keys()));
          var controlKey = (_controlConstantMap$g = controlConstantMap.get(actualValue)) === null || _controlConstantMap$g === void 0 ? void 0 : _controlConstantMap$g.key;
          var controlCompareValue = (0, _random.choice)([actualValue, stateValues[index], (0, _random.getRandomInteger)(-100, 100), controlGen.generate()]); // 'control equality' test

          test = (0, _gen.BinaryExpression)("==", getControlMember(controlKey), (0, _gen.Literal)(controlCompareValue));
          testValue = actualValue == controlCompareValue; // 'control typeof' test

          if ((0, _random.chance)(10)) {
            var compareTypeofValue = (0, _random.choice)(["number", "string", "object", "function", "undefined"]);
            test = (0, _gen.BinaryExpression)("==", (0, _gen.UnaryExpression)("typeof", getControlMember(controlKey)), (0, _gen.Literal)(compareTypeofValue));
            testValue = typeof actualValue === compareTypeofValue;
          } // 'control hasOwnProperty' test


          if ((0, _random.chance)(10)) {
            var hasOwnProperty = (0, _random.choice)([controlKey, controlGen.generate()]);
            test = (0, _gen.CallExpression)((0, _gen.MemberExpression)((0, _gen.Identifier)(controlVar), (0, _gen.Literal)("hasOwnProperty"), true), [(0, _gen.Literal)(hasOwnProperty)]);
            testValue = hasOwnProperty === controlKey;
          }
        }

        return {
          test,
          testValue
        };
      }; // A "state-less" number literal is a Number Literal that is mangled in with the Control properties.
      // Example: X = CONTROL.Y + Z. These can be used anywhere because control properties are constant (unlike state variables)


      const createStatelessNumberLiteral = function (num) {
        var _selectedControlConst2;

        let depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (!controlConstantMap.size || depth > 4 || (0, _random.chance)(75 + depth * 5 + _this.mangledExpressionsMade / 25)) {
          // Add to control constant map?
          if ((0, _random.chance)(25 - controlConstantMap.size - _this.mangledExpressionsMade / 100)) {
            return addControlMapConstant(num);
          }

          return (0, _gen.Literal)(num);
        }

        _this.mangledExpressionsMade++;

        if (controlConstantMap.has(num)) {
          var _controlConstantMap$g2;

          return getControlMember((_controlConstantMap$g2 = controlConstantMap.get(num)) === null || _controlConstantMap$g2 === void 0 ? void 0 : _controlConstantMap$g2.key);
        }

        var allControlNodes = [object];
        parents.filter(x => x.$controlVar && x.$controlConstantMap.size > 0).forEach(node => allControlNodes.push(node));
        var controlNode = (0, _random.choice)(allControlNodes);
        var selectedControlConstantMap = controlNode.$controlConstantMap;
        var selectedControlVar = controlNode.$controlVar;
        var actualValue = (0, _random.choice)(Array.from(selectedControlConstantMap.keys()));
        var controlKey = (_selectedControlConst2 = selectedControlConstantMap.get(actualValue)) === null || _selectedControlConst2 === void 0 ? void 0 : _selectedControlConst2.key;

        if (typeof actualValue === "number") {
          var difference = actualValue - num;
          return (0, _gen.BinaryExpression)("-", getControlMember(controlKey, selectedControlVar), createStatelessNumberLiteral(difference, depth + 1));
        } else if (typeof actualValue === "string") {
          // 'control string length' test
          var compareValue = (0, _random.choice)([actualValue.length, (0, _random.getRandomInteger)(0, 50)]);
          var test = (0, _gen.BinaryExpression)("==", (0, _gen.MemberExpression)(getControlMember(controlKey, selectedControlVar), (0, _gen.Literal)("length"), true), createStatelessNumberLiteral(compareValue, depth + 1));
          var testValue = actualValue.length == compareValue;
          var consequent = createStatelessNumberLiteral(num, depth + 1);
          var alternate = (0, _gen.Literal)((0, _random.getRandomInteger)(-100, 100));
          return (0, _gen.ConditionalExpression)(test, testValue ? consequent : alternate, !testValue ? consequent : alternate);
        } else {
          throw new Error("Unknown: " + typeof actualValue);
        }
      }; // A "state-bound" number literal is a Number Literal that is mangled in with the current state variables
      // Example: X = STATE + Y. This can only be used when the state-values are guaranteed to be known.


      const createStateBoundNumberLiteral = function (num, stateValues) {
        let depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        (0, _assert.ok)(Array.isArray(stateValues)); // Base case: After 4 depth, OR random chance

        if (depth > 4 || (0, _random.chance)(75 + depth * 5 + _this.mangledExpressionsMade / 25)) {
          // Add this number to the control object?
          // Add to control constant map?
          if ((0, _random.chance)(25 - controlConstantMap.size)) {
            return addControlMapConstant(num);
          }

          return (0, _gen.Literal)(num);
        }

        _this.mangledExpressionsMade++;

        if ((0, _random.chance)(10)) {
          return createStatelessNumberLiteral(num, depth + 1);
        } // Terminated predicate


        if ((0, _random.chance)(50)) {
          var {
            test,
            testValue
          } = createPredicate(stateValues);
          var alternateNode = (0, _random.choice)([(0, _gen.Literal)((0, _random.getRandomInteger)(-100, 100)), (0, _gen.Literal)(controlGen.generate()), getControlMember(controlGen.generate())]);
          return (0, _gen.ConditionalExpression)(test, testValue ? (0, _gen.Literal)(num) : alternateNode, !testValue ? (0, _gen.Literal)(num) : alternateNode);
        } // Recursive predicate


        var opposing = (0, _random.getRandomInteger)(0, stateVars.length);

        if ((0, _random.chance)(10)) {
          // state > compare ? real : fake
          var compareValue = (0, _random.choice)([stateValues[opposing], (0, _random.getRandomInteger)(-150, 150)]);
          var operator = (0, _random.choice)(["<", ">", "==", "!="]);
          var answer = {
            ">": compareValue > stateValues[opposing],
            "<": compareValue < stateValues[opposing],
            "==": compareValue === stateValues[opposing],
            "!=": compareValue !== stateValues[opposing]
          }[operator];
          var correct = createStateBoundNumberLiteral(num, stateValues, depth + 1);
          var incorrect = createStateBoundNumberLiteral((0, _random.getRandomInteger)(-150, 150), stateValues, depth + 1);
          return (0, _gen.ConditionalExpression)((0, _gen.BinaryExpression)(operator, createStateBoundNumberLiteral(compareValue, stateValues, depth + 1), (0, _gen.Identifier)(stateVars[opposing])), answer ? correct : incorrect, answer ? incorrect : correct);
        } // state + 10 = <REAL>


        var difference = num - stateValues[opposing];

        if (difference === 0) {
          return (0, _gen.Identifier)(stateVars[opposing]);
        }

        return (0, _gen.BinaryExpression)("+", (0, _gen.Identifier)(stateVars[opposing]), createStateBoundNumberLiteral(difference, stateValues, depth + 1));
      };

      var outlinesCreated = 0;

      const isExpression = (object, parents) => {
        var fnIndex = parents.findIndex(x => (0, _insert.isFunction)(x));

        if (fnIndex != -1) {
          // This does NOT mutate
          parents = parents.slice(0, fnIndex);
        }

        var assignmentIndex = parents.findIndex(x => x.type === "AssignmentExpression"); // Left-hand assignment validation

        if (assignmentIndex != -1) {
          if (parents[assignmentIndex].left === (parents[assignmentIndex - 1] || object)) {
            return false;
          }
        } // For in/of left validation


        var forInOfIndex = parents.findIndex(x => x.type === "ForInStatement" || x.type === "ForOfStatement");

        if (forInOfIndex != -1) {
          if (parents[forInOfIndex].left === (parents[forInOfIndex - 1] || object)) {
            return false;
          }
        } // Bound call-expression validation


        var callExpressionIndex = parents.findIndex(x => x.type === "CallExpression");

        if (callExpressionIndex != -1) {
          if (parents[callExpressionIndex].callee == (parents[callExpressionIndex - 1] || object)) {
            var callee = parents[callExpressionIndex].callee; // Detected bound call expression. Not supported.

            if (callee.type === "MemberExpression") {
              return false;
            }
          }
        } // Update-expression validation:


        var updateExpressionIndex = parents.findIndex(x => x.type === "UpdateExpression");
        if (updateExpressionIndex !== -1) return false;
        return true;
      }; // This function checks if the expression or statements is possible to be outlined


      const canOutline = (object, parents) => {
        var isIllegal = false;
        var breakStatements = [];
        var returnStatements = [];

        if (!Array.isArray(object) && !isExpression(object, parents)) {
          return {
            isIllegal: true,
            breakStatements: [],
            returnStatements: []
          };
        }

        (0, _traverse.walk)(object, parents, (o, p) => {
          if (o.type === "ThisExpression" || o.type === "MetaProperty" || o.type === "Super") {
            isIllegal = true;
            return "EXIT";
          }

          if (o.type === "BreakStatement") {
            // This can be safely outlined
            if (o.label && o.label.name === switchLabel) {
              breakStatements.push([o, p]);
            } else {
              isIllegal = true;
              return "EXIT";
            }
          }

          if ((o.type === "ContinueStatement" || o.type === "AwaitExpression" || o.type === "YieldExpression" || o.type === "ReturnStatement" || o.type === "VariableDeclaration" || o.type === "FunctionDeclaration" || o.type === "ClassDeclaration") && !p.find(x => (0, _insert.isVarContext)(x))) {
            // This can be safely outlined
            if (o.type === "ReturnStatement") {
              returnStatements.push([o, p]);
            } else {
              isIllegal = true;
              return "EXIT";
            }
          }

          if (o.type === "Identifier") {
            if (o.name === "arguments") {
              isIllegal = true;
              return "EXIT";
            }
          }
        });
        return {
          isIllegal,
          breakStatements,
          returnStatements
        };
      };

      const createOutlineFunction = (body, stateValues, label) => {
        var key = controlGen.generate();
        var functionExpression = (0, _gen.FunctionExpression)([], body);

        if (!this.options.es5 && (0, _random.chance)(50)) {
          functionExpression.type = "ArrowFunctionExpression";
        }

        controlProperties.push((0, _gen.Property)((0, _gen.Literal)(key), functionExpression, false)); // Add dead code to function

        if (!this.isDebug && (0, _random.chance)(25)) {
          var {
            test,
            testValue
          } = createPredicate(stateValues);
          var deadCodeVar = this.getPlaceholder();
          functionExpression.params.push((0, _gen.AssignmentPattern)((0, _gen.Identifier)(deadCodeVar), test));
          var alternate = [(0, _gen.ReturnStatement)((0, _random.choice)([(0, _gen.BinaryExpression)("==", (0, _gen.Identifier)((0, _random.choice)(stateVars)), (0, _gen.Literal)((0, _random.getRandomInteger)(-100, 100))), (0, _gen.Literal)(controlGen.generate()), (0, _gen.Identifier)("arguments"), (0, _gen.Identifier)((0, _random.choice)(stateVars)), (0, _gen.Identifier)(controlVar), (0, _gen.CallExpression)(getControlMember(controlGen.generate()), [])]))];
          functionExpression.body.body.unshift((0, _gen.IfStatement)(testValue ? (0, _gen.UnaryExpression)("!", (0, _gen.Identifier)(deadCodeVar)) : (0, _gen.Identifier)(deadCodeVar), alternate));
        }

        outlinesCreated++;
        return key;
      };

      const attemptOutlineStatements = (statements, parentBlock, stateValues, label) => {
        if (this.isDebug || !this.outlineStatements || (0, _random.chance)(75 + outlinesCreated - this.mangledExpressionsMade / 25)) {
          return;
        }

        var index = parentBlock.indexOf(statements[0]);
        if (index === -1) return;
        var outlineInfo = canOutline(statements, parentBlock);
        if (outlineInfo.isIllegal) return;
        var breakFlag = controlGen.generate();
        outlineInfo.breakStatements.forEach(_ref => {
          let [breakStatement, p] = _ref;
          this.replace(breakStatement, (0, _gen.ReturnStatement)((0, _gen.Literal)(breakFlag)));
        });
        var returnFlag = controlGen.generate();
        outlineInfo.returnStatements.forEach(_ref2 => {
          let [returnStatement, p] = _ref2;
          var argument = returnStatement.argument || (0, _gen.Identifier)("undefined");
          this.replace(returnStatement, (0, _gen.ReturnStatement)((0, _gen.ObjectExpression)([(0, _gen.Property)((0, _gen.Literal)(returnFlag), argument, false)])));
        }); // Outline these statements!

        var key = createOutlineFunction((0, _insert.clone)(statements), stateValues, label);
        var callExpression = (0, _gen.CallExpression)(getControlMember(key), []);
        var newStatements = [];

        if (outlineInfo.breakStatements.length === 0 && outlineInfo.returnStatements.length === 0) {
          newStatements.push((0, _gen.ExpressionStatement)(callExpression));
        } else if (outlineInfo.returnStatements.length === 0) {
          newStatements.push((0, _gen.IfStatement)((0, _gen.BinaryExpression)("==", callExpression, (0, _gen.Literal)(breakFlag)), [(0, _gen.BreakStatement)(switchLabel)]));
        } else {
          var tempVar = this.getPlaceholder();
          newStatements.push((0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(tempVar, callExpression)));

          const t = str => (0, _template.default)(str).single().expression;

          newStatements.push((0, _gen.IfStatement)(t("".concat(tempVar, " === \"").concat(breakFlag, "\"")), [(0, _gen.BreakStatement)(switchLabel)], [(0, _gen.IfStatement)(t("typeof ".concat(tempVar, " == \"object\"")), [(0, _gen.ReturnStatement)(t("".concat(tempVar, "[\"").concat(returnFlag, "\"]")))])]));
        } // Remove the original statements from the block and replace it with the call expression


        parentBlock.splice(index, statements.length, ...newStatements);
      };

      const attemptOutlineExpression = (expression, expressionParents, stateValues, label) => {
        if (this.isDebug || !this.outlineExpressions || (0, _random.chance)(75 + outlinesCreated - this.mangledExpressionsMade / 25)) {
          return;
        }

        var outlineInfo = canOutline(expression, expressionParents);
        if (outlineInfo.isIllegal || outlineInfo.breakStatements.length || outlineInfo.returnStatements.length) return; // Outline this expression!

        var key = createOutlineFunction([(0, _gen.ReturnStatement)((0, _insert.clone)(expression))], stateValues, label);
        var callExpression = (0, _gen.CallExpression)(getControlMember(key), []);
        this.replaceIdentifierOrLiteral(expression, callExpression, expressionParents);
      };

      const createTransitionExpression = (index, add, mutatingStateValues, label) => {
        var beforeStateValues = [...mutatingStateValues];
        var newValue = mutatingStateValues[index] + add;
        var expr = null;

        if (this.isDebug) {
          // state = NEW_STATE
          expr = (0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)(stateVars[index]), (0, _gen.Literal)(newValue));
        } else if ((0, _random.chance)(90)) {
          // state += (NEW_STATE - CURRENT_STATE)
          expr = (0, _gen.AssignmentExpression)("+=", (0, _gen.Identifier)(stateVars[index]), createStateBoundNumberLiteral(add, mutatingStateValues));
        } else {
          // state *= 2
          // state -= DIFFERENCE
          var double = mutatingStateValues[index] * 2;
          var diff = double - newValue;
          var first = (0, _gen.AssignmentExpression)("*=", (0, _gen.Identifier)(stateVars[index]), createStateBoundNumberLiteral(2, mutatingStateValues));
          mutatingStateValues[index] = double;
          expr = (0, _gen.SequenceExpression)([first, (0, _gen.AssignmentExpression)("-=", (0, _gen.Identifier)(stateVars[index]), createStateBoundNumberLiteral(diff, mutatingStateValues))]);
        }

        mutatingStateValues[index] = newValue; // These are lower quality outlines vs. the entire transition outline

        if ((0, _random.chance)(50)) {
          attemptOutlineExpression(expr, [], [...beforeStateValues], label);
        }

        return expr;
      };

      var cases = [];
      chunks.forEach((chunk, i) => {
        // skip last case, its empty and never ran
        if (chunk.label === endLabel) {
          return;
        }

        (0, _assert.ok)(labelToStates[chunk.label]);
        var state = caseStates[i];
        var staticStateValues = [...labelToStates[chunk.label]];
        var potentialBranches = new Set();
        [...chunk.body].forEach(stmt => {
          (0, _traverse.walk)(stmt, [], (o, p) => {
            // This mangles certain literals with the state variables
            // Ex: A number literal (50) changed to a expression (stateVar + 40), when stateVar = 10
            if (!this.isDebug && o.type === "Literal" && !p.find(x => (0, _insert.isVarContext)(x))) {
              if (typeof o.value === "number" && Math.floor(o.value) === o.value && // Only whole numbers
              Math.abs(o.value) < 100000 && // Hard-coded limit
              this.mangleNumberLiterals && (0, _random.chance)(50 - this.mangledExpressionsMade / 100)) {
                // 50 -> state1 - 10, when state1 = 60. The result is still 50
                return () => {
                  this.replaceIdentifierOrLiteral(o, createStateBoundNumberLiteral(o.value, staticStateValues), p);
                };
              }

              if (typeof o.value === "boolean" && this.mangleBooleanLiterals && (0, _random.chance)(50 - this.mangledExpressionsMade / 100)) {
                // true -> state1 == 10, when state1 = 10. The result is still true
                // Choose a random state var to compare again
                var index = (0, _random.getRandomInteger)(0, stateVars.length);
                var compareValue = staticStateValues[index]; // When false, always choose a different number, so the expression always equals false

                while (!o.value && compareValue === staticStateValues[index]) {
                  compareValue = (0, _random.getRandomInteger)(-150, 150);
                }

                var mangledExpression = (0, _gen.BinaryExpression)("==", (0, _gen.Identifier)(stateVars[index]), createStateBoundNumberLiteral(compareValue, staticStateValues));
                return () => {
                  this.replaceIdentifierOrLiteral(o, mangledExpression, p);
                  attemptOutlineExpression(o, p, staticStateValues, chunk.label);
                };
              }
            } // Mangle certain referenced identifiers
            // console.log("hi") -> (x ? console : window).log("hi"), when is x true. The result is the same


            if (!this.isDebug && o.type === "Identifier" && this.mangleIdentifiers && (0, _random.chance)(50 - this.mangledExpressionsMade / 100) && !p.find(x => (0, _insert.isVarContext)(x))) {
              // ONLY referenced identifiers (like actual variable names) can be changed
              var info = (0, _identifiers.getIdentifierInfo)(o, p);

              if (!info.spec.isReferenced || info.spec.isDefined || info.spec.isModified || info.spec.isExported) {
                return;
              } // TYPEOF expression check


              if (p[0] && p[0].type === "UnaryExpression" && p[0].operator === "typeof" && p[0].argument === o) {
                return;
              } // Update expression check


              if (p[0] && p[0].type === "UpdateExpression") {
                return;
              } // FOR-in/of initializer check


              if ((0, _insert.isForInitialize)(o, p) === "left-hand") {
                return;
              }

              var {
                test,
                testValue
              } = createPredicate(staticStateValues); // test && real

              var mangledExpression = (0, _gen.LogicalExpression)(testValue ? "&&" : "||", test, (0, _gen.Identifier)(o.name)); // control.fake = real

              if ((0, _random.chance)(50)) {
                mangledExpression = (0, _gen.AssignmentExpression)("=", getControlMember(controlGen.generate()), (0, _gen.Identifier)(o.name));
              } // test ? real : fake


              if ((0, _random.chance)(50)) {
                var alternateName = (0, _random.choice)([controlVar, ...stateVars, ...this.options.globalVariables, ..._constants.reservedIdentifiers]); // Don't use 'arguments'

                if (alternateName === "arguments") alternateName = "undefined";
                mangledExpression = (0, _gen.ConditionalExpression)(test, (0, _gen.Identifier)(testValue ? o.name : alternateName), (0, _gen.Identifier)(!testValue ? o.name : alternateName));
              }

              return () => {
                this.replaceIdentifierOrLiteral(o, mangledExpression, p);
              };
            } // Function outlining: bring out certain expressions


            if (!this.isDebug && o.type && ["BinaryExpression", "LogicalExpression", "CallExpression", "AssignmentExpression", "MemberExpression", "ObjectExpression", "ConditionalExpression"].includes(o.type) && !(0, _random.chance)(p.length * 5) && // The further down the tree the lower quality of expression
            !p.find(x => (0, _insert.isContext)(x) || x.$outlining)) {
              o.$outlining = true;
              return () => {
                attemptOutlineExpression(o, p, staticStateValues, chunk.label);
              };
            } // Opaque predicates: If Statements, Conditional Statements, Switch Case test


            if (!this.isDebug && this.addOpaquePredicates && p[0] && (0, _random.chance)(50 - outlinesCreated - this.mangledExpressionsMade / 100)) {
              var isTestExpression = p[0].type == "IfStatement" && p[0].test === o || p[0].type === "ConditionalExpression" && p[0].test === o || p[0].type === "SwitchCase" && p[0].test === o;

              if (isTestExpression && !p.find(x => (0, _insert.isContext)(x))) {
                return () => {
                  var {
                    test,
                    testValue
                  } = createPredicate(staticStateValues);
                  this.replace(o, (0, _gen.LogicalExpression)(testValue ? "&&" : "||", test, (0, _insert.clone)(o)));
                };
              }
            }

            if (o.type == "StateIdentifier") {
              return () => {
                (0, _assert.ok)(labelToStates[o.label]);
                this.replace(o, (0, _gen.ArrayExpression)(labelToStates[o.label].map(_gen.Literal)));
              };
            }

            if (o.type == "GotoStatement") {
              return () => {
                var blockIndex = p.findIndex(node => (0, _traverse.isBlock)(node) || node.type === "SwitchCase");

                if (blockIndex === -1) {
                  var index = chunk.body.indexOf(stmt);
                  (0, _assert.ok)(index != -1); // Top level: Insert break statement in the chunk body
                  // This is OKAY because this forEach uses a cloned version of the body `[...chunk.body]`

                  chunk.body.splice(index + 1, 0, (0, _gen.BreakStatement)(switchLabel));
                } else {
                  var block = p[blockIndex];

                  if (block.type === "SwitchCase") {
                    // Handle switch case break placement (Important!)
                    block.consequent.splice(block.consequent.indexOf(p[blockIndex - 2] || o) + 1, 0, (0, _gen.BreakStatement)(switchLabel));
                  } else {
                    // Standard block placement
                    var child = p[blockIndex - 2] || o;
                    var childIndex = block.body.indexOf(child);
                    block.body.splice(childIndex + 1, 0, (0, _gen.BreakStatement)(switchLabel));
                  }
                }

                if (!o.impossible) {
                  potentialBranches.add(o.label);
                }

                var mutatingStateValues = [...labelToStates[chunk.label]];
                var nextStateValues = labelToStates[o.label];
                (0, _assert.ok)(nextStateValues, o.label);
                var transitionExpressions = [];

                for (var stateValueIndex = 0; stateValueIndex < stateVars.length; stateValueIndex++) {
                  var diff = nextStateValues[stateValueIndex] - mutatingStateValues[stateValueIndex]; // Only add if state value changed
                  // If pointing to itself then always add to ensure SequenceExpression isn't empty

                  if (diff !== 0 || o.label === chunk.label) {
                    transitionExpressions.push(createTransitionExpression(stateValueIndex, diff, mutatingStateValues, chunk.label));
                  }
                }

                (0, _assert.ok)(transitionExpressions.length !== 0);
                var sequenceExpression = (0, _gen.SequenceExpression)(transitionExpressions); // Check if flagged and additional code here

                if (typeof flaggedLabels[o.label] === "object") {
                  var {
                    flagKey,
                    flagValue
                  } = flaggedLabels[o.label];
                  sequenceExpression.expressions.push((0, _gen.AssignmentExpression)("=", getControlMember(flagKey), (0, _gen.Literal)(flagValue)));
                }

                attemptOutlineExpression(sequenceExpression, [], staticStateValues, chunk.label);
                this.replace(o, (0, _gen.ExpressionStatement)(sequenceExpression));
              };
            }
          });
        });
        attemptOutlineStatements(chunk.body, chunk.body, staticStateValues, chunk.label);

        if (!chunk.impossible) {// FUTURE OBFUSCATION IDEA: Update controlObject based on 'potentialBranches' code
          // This idea would require a lot of work but would make some seriously effective obfuscation
          // for protecting the data. In 'inactive' states the data could be overwritten to fake values
          // And in the 'active' state the data would brought back just in time. This would require the controlObject
          // state to be known in all chunks
        }

        var caseObject = {
          body: chunk.body,
          state: state,
          label: chunk.label
        };
        cases.push(caseObject);
      });

      if (!this.isDebug && this.addDeadCode) {
        // Add fake control object updates
        chunks.forEach(chunk => {
          if ((0, _random.chance)(10)) {
            // These deadCode variants can NOT break the state/control variables
            // They are executed!
            var deadCodeChoices = [(0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", getControlMember(controlGen.generate()), (0, _gen.Literal)(controlGen.generate()))), (0, _gen.ExpressionStatement)((0, _gen.UnaryExpression)("delete", getControlMember(controlGen.generate())))]; // These deadCode variants can make breaking changes
            // because they are never ran

            if (chunk.impossible) {
              var randomControlKey = (0, _random.choice)(controlProperties.map(prop => {
                var _prop$key;

                return (_prop$key = prop.key) === null || _prop$key === void 0 ? void 0 : _prop$key.value;
              }).filter(x => x && typeof x === "string")) || controlGen.generate();
              deadCodeChoices = deadCodeChoices.concat([(0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)(controlVar), (0, _gen.Literal)(false))), (0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", (0, _gen.Identifier)(controlVar), (0, _gen.Identifier)("undefined"))), (0, _gen.ExpressionStatement)((0, _gen.AssignmentExpression)("=", getControlMember(randomControlKey), (0, _gen.Identifier)("undefined"))), (0, _gen.ExpressionStatement)((0, _gen.UnaryExpression)("delete", getControlMember(randomControlKey)))]);
            }

            chunk.body.unshift((0, _random.choice)(deadCodeChoices));
          }
        });
      }

      if (!this.isDebug) {
        (0, _random.shuffle)(cases);
        (0, _random.shuffle)(controlProperties);
      }

      var discriminant = (0, _template.default)("".concat(stateVars.join("+"))).single().expression;
      objectBody.length = 0; // Perverse position of import declarations

      for (var importDeclaration of importDeclarations) {
        objectBody.push(importDeclaration);
      } // As well as functions are brought up


      for (var functionName of functionDeclarationNames) {
        objectBody.push((0, _gen.VariableDeclaration)((0, _gen.VariableDeclarator)(functionName, functionDeclarationValues.get(functionName))));
      }

      var defaultCaseIndex = (0, _random.getRandomInteger)(0, cases.length);
      var switchCases = [];
      cases.forEach((caseObject, i) => {
        var _caseObject$body$0$la;

        // Empty case OR single break statement is skipped
        if (caseObject.body.length === 0 || caseObject.body.length === 1 && caseObject.body[0].type === "BreakStatement" && ((_caseObject$body$0$la = caseObject.body[0].label) === null || _caseObject$body$0$la === void 0 ? void 0 : _caseObject$body$0$la.name) === switchLabel) return;
        var test = (0, _gen.Literal)(caseObject.state);
        var isEligibleForOutlining = false; // Check if Control Map has this value

        if (!this.isDebug && controlConstantMap.has(caseObject.state)) {
          var _controlConstantMap$g3;

          test = getControlMember((_controlConstantMap$g3 = controlConstantMap.get(caseObject.state)) === null || _controlConstantMap$g3 === void 0 ? void 0 : _controlConstantMap$g3.key);
        } // Create complex test expressions for each switch case


        if (!this.isDebug && this.addComplexTest && (0, _random.chance)(25)) {
          isEligibleForOutlining = true; // case STATE+X:

          var stateVarIndex = (0, _random.getRandomInteger)(0, stateVars.length);
          var stateValues = labelToStates[caseObject.label];
          var difference = stateValues[stateVarIndex] - caseObject.state;
          var conditionNodes = [];
          var alreadyConditionedItems = new Set(); // This code finds clash conditions and adds them to 'conditionNodes' array

          Object.keys(labelToStates).forEach(label => {
            if (label !== caseObject.label) {
              var labelStates = labelToStates[label];
              var totalState = labelStates.reduce((a, b) => a + b, 0);

              if (totalState === labelStates[stateVarIndex] - difference) {
                var differentIndex = labelStates.findIndex((v, i) => v !== stateValues[i]);

                if (differentIndex !== -1) {
                  var expressionAsString = stateVars[differentIndex] + "!=" + labelStates[differentIndex];

                  if (!alreadyConditionedItems.has(expressionAsString)) {
                    alreadyConditionedItems.add(expressionAsString);
                    conditionNodes.push((0, _gen.BinaryExpression)("!=", (0, _gen.Identifier)(stateVars[differentIndex]), (0, _gen.Literal)(labelStates[differentIndex])));
                  }
                } else {
                  conditionNodes.push((0, _gen.BinaryExpression)("!=", (0, _insert.clone)(discriminant), (0, _gen.Literal)(totalState)));
                }
              }
            }
          }); // case STATE!=Y && STATE+X

          test = (0, _gen.BinaryExpression)("-", (0, _gen.Identifier)(stateVars[stateVarIndex]), (0, _gen.Literal)(difference)); // Use the 'conditionNodes' to not cause state clashing issues

          conditionNodes.forEach(conditionNode => {
            test = (0, _gen.LogicalExpression)("&&", conditionNode, test);
          });
        } // A 'flagged' label has addition 'flagKey' that gets switched before jumped to


        if (flaggedLabels[caseObject.label]) {
          isEligibleForOutlining = true;
          var {
            flagKey,
            flagValue
          } = flaggedLabels[caseObject.label];
          var alternateNum;

          do {
            alternateNum = (0, _random.getRandomInteger)(-1000, 1000 + chunks.length);
          } while (caseSelection.has(alternateNum));

          var alternate = (0, _gen.Literal)(alternateNum); // case FLAG ? <REAL> : <FAKE>:

          test = (0, _gen.ConditionalExpression)(getControlMember(flagKey), flagValue ? test : alternate, !flagValue ? test : alternate);
        } // Outline this switch case test


        if (!this.isDebug && this.outlineExpressions && isEligibleForOutlining && (0, _random.chance)(75 - outlinesCreated - this.mangledExpressionsMade / 25)) {
          this.mangledExpressionsMade++; // Selected a random parent node (or this node) to insert this function in

          var selectedControlNode = (0, _random.choice)(allControlNodes);
          var selectedControlProperties = selectedControlNode.$controlProperties;
          var selectedControlVar = selectedControlNode.$controlVar;
          var selectedControlGen = selectedControlNode.$controlGen;
          var fnKey = selectedControlGen.generate(); // Pass in the:
          // - controlVar for 'flagged labels' code check
          // - stateVars for 'complex test expressions'
          // (Check which identifiers are actually needed)

          var argumentList = [],
              watchingFor = new Set([controlVar, ...stateVars]);
          (0, _traverse.walk)(test, [], (o, p) => {
            if (o.type === "Identifier" && watchingFor.has(o.name)) {
              watchingFor.delete(o.name);
              argumentList.push((0, _gen.Identifier)(o.name));
            }
          });
          selectedControlProperties.push((0, _gen.Property)((0, _gen.Literal)(fnKey), (0, _gen.FunctionExpression)(argumentList, [(0, _gen.ReturnStatement)(test)]), true)); // case control.a(control, s1, s2):

          test = (0, _gen.CallExpression)(getControlMember(fnKey, selectedControlVar), (0, _insert.clone)(argumentList));
        } // One random case gets to be default


        if (!this.isDebug && i === defaultCaseIndex) test = null;
        var testArray = [test];

        if (!this.isDebug && this.addFakeTest && (0, _random.chance)(50)) {
          // Add fake test
          // case <FAKE>:
          // case <REAL>:
          // case <FAKE>:
          var fakeTestCount = (0, _random.getRandomInteger)(1, 4);

          for (var i = 0; i < fakeTestCount; i++) {
            // Create a fake test number that doesn't interfere with the actual states
            var fakeTestNum;

            do {
              fakeTestNum = (0, _random.getRandomInteger)(1, 1000 + caseSelection.size);
            } while (caseSelection.has(fakeTestNum)); // Add this fake test


            testArray.push((0, _gen.Literal)(fakeTestNum));
          }

          (0, _random.shuffle)(testArray);
        }

        testArray.forEach((test, i) => {
          var body = i === testArray.length - 1 ? caseObject.body : [];
          switchCases.push((0, _gen.SwitchCase)(test, body));
        });
      }); // switch(state) { case ... }

      var switchStatement = (0, _gen.SwitchStatement)(discriminant, switchCases);
      var declarations = []; // var state = START_STATE

      declarations.push(...stateVars.map((stateVar, i) => {
        return (0, _gen.VariableDeclarator)(stateVar, (0, _gen.Literal)(initStateValues[i]));
      })); // var control = { strings, numbers, outlined functions, etc... }

      var objectExpression = (0, _gen.ObjectExpression)(controlProperties);
      declarations.push((0, _gen.VariableDeclarator)(controlVar, objectExpression));
      objectBody.push( // Use individual variable declarations instead so Stack can apply
      ...declarations.map(declaration => (0, _gen.VariableDeclaration)(declaration, "var"))); // while (state != END_STATE) {...}

      var whileTest = (0, _gen.BinaryExpression)("!=", (0, _insert.clone)(discriminant), (0, _gen.Literal)(endState));
      objectBody.push((0, _gen.WhileStatement)(whileTest, [(0, _gen.LabeledStatement)(switchLabel, switchStatement)])); // mark this object for switch case obfuscation

      switchStatement.$controlFlowFlattening = true;
    };
  }

}

exports.default = ControlFlowFlattening;