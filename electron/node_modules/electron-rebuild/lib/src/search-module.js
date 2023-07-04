"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectRootPath = exports.searchForNodeModules = exports.searchForModule = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
async function shouldContinueSearch(traversedPath, rootPath, stopAtPackageJSON) {
    if (rootPath) {
        return Promise.resolve(traversedPath !== path.dirname(rootPath));
    }
    else if (stopAtPackageJSON) {
        return fs.pathExists(path.join(traversedPath, 'package.json'));
    }
    else {
        return true;
    }
}
async function traverseAncestorDirectories(cwd, pathGenerator, rootPath, maxItems, stopAtPackageJSON) {
    const paths = [];
    let traversedPath = path.resolve(cwd);
    while (await shouldContinueSearch(traversedPath, rootPath, stopAtPackageJSON)) {
        const generatedPath = pathGenerator(traversedPath);
        if (await fs.pathExists(generatedPath)) {
            paths.push(generatedPath);
        }
        const parentPath = path.dirname(traversedPath);
        if (parentPath === traversedPath || (maxItems && paths.length >= maxItems)) {
            break;
        }
        traversedPath = parentPath;
    }
    return paths;
}
/**
 * Find all instances of a given module in node_modules subdirectories while traversing up
 * ancestor directories.
 *
 * @param cwd the initial directory to traverse
 * @param moduleName the Node module name (should work for scoped modules as well)
 * @param rootPath the project's root path. If provided, the traversal will stop at this path.
 */
async function searchForModule(cwd, moduleName, rootPath) {
    const pathGenerator = (traversedPath) => path.join(traversedPath, 'node_modules', moduleName);
    return traverseAncestorDirectories(cwd, pathGenerator, rootPath, undefined, true);
}
exports.searchForModule = searchForModule;
/**
 * Find all instances of node_modules subdirectories while traversing up ancestor directories.
 *
 * @param cwd the initial directory to traverse
 * @param rootPath the project's root path. If provided, the traversal will stop at this path.
 */
async function searchForNodeModules(cwd, rootPath) {
    const pathGenerator = (traversedPath) => path.join(traversedPath, 'node_modules');
    return traverseAncestorDirectories(cwd, pathGenerator, rootPath, undefined, true);
}
exports.searchForNodeModules = searchForNodeModules;
/**
 * Determine the root directory of a given project, by looking for a directory with an
 * NPM or yarn lockfile.
 *
 * @param cwd the initial directory to traverse
 */
async function getProjectRootPath(cwd) {
    for (const lockFilename of ['yarn.lock', 'package-lock.json']) {
        const pathGenerator = (traversedPath) => path.join(traversedPath, lockFilename);
        const lockPaths = await traverseAncestorDirectories(cwd, pathGenerator, undefined, 1);
        if (lockPaths.length > 0) {
            return path.dirname(lockPaths[0]);
        }
    }
    return cwd;
}
exports.getProjectRootPath = getProjectRootPath;
//# sourceMappingURL=search-module.js.map