"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleWalker = void 0;
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const read_package_json_1 = require("./read-package-json");
const search_module_1 = require("./search-module");
const d = (0, debug_1.default)('electron-rebuild');
class ModuleWalker {
    constructor(buildPath, projectRootPath, types, prodDeps, onlyModules) {
        this.buildPath = buildPath;
        this.modulesToRebuild = [];
        this.projectRootPath = projectRootPath;
        this.types = types;
        this.prodDeps = prodDeps;
        this.onlyModules = onlyModules;
        this.realModulePaths = new Set();
        this.realNodeModulesPaths = new Set();
    }
    get nodeModulesPaths() {
        return (0, search_module_1.searchForNodeModules)(this.buildPath, this.projectRootPath);
    }
    async walkModules() {
        const rootPackageJson = await (0, read_package_json_1.readPackageJson)(this.buildPath);
        const markWaiters = [];
        const depKeys = [];
        if (this.types.includes('prod') || this.onlyModules) {
            depKeys.push(...Object.keys(rootPackageJson.dependencies || {}));
        }
        if (this.types.includes('optional') || this.onlyModules) {
            depKeys.push(...Object.keys(rootPackageJson.optionalDependencies || {}));
        }
        if (this.types.includes('dev') || this.onlyModules) {
            depKeys.push(...Object.keys(rootPackageJson.devDependencies || {}));
        }
        for (const key of depKeys) {
            this.prodDeps[key] = true;
            const modulePaths = await (0, search_module_1.searchForModule)(this.buildPath, key, this.projectRootPath);
            for (const modulePath of modulePaths) {
                markWaiters.push(this.markChildrenAsProdDeps(modulePath));
            }
        }
        await Promise.all(markWaiters);
        d('identified prod deps:', this.prodDeps);
    }
    async findModule(moduleName, fromDir, foundFn) {
        const testPaths = await (0, search_module_1.searchForModule)(fromDir, moduleName, this.projectRootPath);
        const foundFns = testPaths.map(testPath => foundFn(testPath));
        return Promise.all(foundFns);
    }
    async markChildrenAsProdDeps(modulePath) {
        if (!await fs_extra_1.default.pathExists(modulePath)) {
            return;
        }
        d('exploring', modulePath);
        let childPackageJson;
        try {
            childPackageJson = await (0, read_package_json_1.readPackageJson)(modulePath, true);
        }
        catch (err) {
            return;
        }
        const moduleWait = [];
        const callback = this.markChildrenAsProdDeps.bind(this);
        for (const key of Object.keys(childPackageJson.dependencies || {}).concat(Object.keys(childPackageJson.optionalDependencies || {}))) {
            if (this.prodDeps[key]) {
                continue;
            }
            this.prodDeps[key] = true;
            moduleWait.push(this.findModule(key, modulePath, callback));
        }
        await Promise.all(moduleWait);
    }
    async findAllModulesIn(nodeModulesPath, prefix = '') {
        // Some package managers use symbolic links when installing node modules
        // we need to be sure we've never tested the a package before by resolving
        // all symlinks in the path and testing against a set
        const realNodeModulesPath = await fs_extra_1.default.realpath(nodeModulesPath);
        if (this.realNodeModulesPaths.has(realNodeModulesPath)) {
            return;
        }
        this.realNodeModulesPaths.add(realNodeModulesPath);
        d('scanning:', realNodeModulesPath);
        for (const modulePath of await fs_extra_1.default.readdir(realNodeModulesPath)) {
            // Ignore the magical .bin directory
            if (modulePath === '.bin')
                continue;
            // Ensure that we don't mark modules as needing to be rebuilt more than once
            // by ignoring / resolving symlinks
            const realPath = await fs_extra_1.default.realpath(path_1.default.resolve(nodeModulesPath, modulePath));
            if (this.realModulePaths.has(realPath)) {
                continue;
            }
            this.realModulePaths.add(realPath);
            if (this.prodDeps[`${prefix}${modulePath}`] && (!this.onlyModules || this.onlyModules.includes(modulePath))) {
                this.modulesToRebuild.push(realPath);
            }
            if (modulePath.startsWith('@')) {
                await this.findAllModulesIn(realPath, `${modulePath}/`);
            }
            if (await fs_extra_1.default.pathExists(path_1.default.resolve(nodeModulesPath, modulePath, 'node_modules'))) {
                await this.findAllModulesIn(path_1.default.resolve(realPath, 'node_modules'));
            }
        }
    }
}
exports.ModuleWalker = ModuleWalker;
//# sourceMappingURL=module-walker.js.map