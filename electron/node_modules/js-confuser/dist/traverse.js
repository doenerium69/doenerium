"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertNoCircular = assertNoCircular;
exports.default = traverse;
exports.getBlock = getBlock;
exports.isBlock = isBlock;
exports.walk = walk;

/**
 * A block refers to any object that has a **`.body`** property where code is nested.
 *
 * Types: `BlockStatement`, `Program`
 *
 * @param object
 * @param parents
 */
function getBlock(object, parents) {
  if (!Array.isArray(parents)) {
    throw new Error("parents must be an array");
  }

  return [object, ...parents].find(node => isBlock(node));
}
/**
 * Must have a **`.body`** property and be an array.
 *
 * - "BlockStatement"
 * - "Program"
 *
 * @param object
 */


function isBlock(object) {
  return object && (object.type == "BlockStatement" || object.type == "Program");
}

function walk(object, parents, onEnter) {
  if (typeof object === "object" && object) {
    var newParents = [object, ...parents]; // if (!Array.isArray(object)) {
    //   validateChain(object, parents);
    // }
    // 1. Call `onEnter` function and remember any onExit callback returned

    var onExit = onEnter(object, parents); // 2. Traverse children

    if (Array.isArray(object)) {
      var copy = [...object];

      for (var element of copy) {
        if (walk(element, newParents, onEnter) === "EXIT") {
          return "EXIT";
        }
      }
    } else {
      var keys = Object.keys(object);

      for (var key of keys) {
        if (!key.startsWith("$")) {
          if (walk(object[key], newParents, onEnter) === "EXIT") {
            return "EXIT";
          }
        }
      }
    }

    if (onExit === "EXIT") {
      return "EXIT";
    } // 3. Done with children, call `onExit` callback


    if (onExit) {
      onExit();
    }
  }
}
/**
 * The bare-bones walker.
 *
 * - Recursively traverse an AST object.
 * - Calls the `onEnter` function with:
 * - - `object` - The current node
 * - - `parents` - Array of ancestors `[closest, ..., root]`
 * - The `onEnter` callback can return an `onExit` callback for that node.
 *
 * - *Note*: Does not validate the property names.
 *
 * @param tree
 * @param onEnter
 */


function traverse(tree, onEnter) {
  walk(tree, [], onEnter);
}
/**
 * This is debugging function used to test for circular references.
 */


function assertNoCircular(object) {
  var seen = new Set();
  traverse(object, (node, nodeParents) => {
    if (node && typeof node === "object") {
      if (seen.has(node)) {
        console.log(nodeParents);
        console.log(node);
        throw new Error("FOUND CIRCULAR REFERENCE");
      }

      seen.add(node);
    }
  });
}