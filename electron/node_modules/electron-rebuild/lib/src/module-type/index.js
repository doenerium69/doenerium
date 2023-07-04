"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locateBinary = exports.NativeModule = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const node_api_1 = require("../node-api");
const read_package_json_1 = require("../read-package-json");
class NativeModule {
    constructor(rebuilder, modulePath) {
        this.rebuilder = rebuilder;
        this.modulePath = modulePath;
        this.nodeAPI = new node_api_1.NodeAPI(this.moduleName, this.rebuilder.electronVersion);
    }
    get moduleName() {
        if (!this._moduleName) {
            const basename = path_1.default.basename(this.modulePath);
            const parentDir = path_1.default.basename(path_1.default.dirname(this.modulePath));
            if (parentDir.startsWith('@')) {
                this._moduleName = `${parentDir}/${basename}`;
            }
            this._moduleName = basename;
        }
        return this._moduleName;
    }
    async packageJSONFieldWithDefault(key, defaultValue) {
        const result = await this.packageJSONField(key);
        return result === undefined ? defaultValue : result;
    }
    async packageJSONField(key) {
        this.packageJSON || (this.packageJSON = await (0, read_package_json_1.readPackageJson)(this.modulePath));
        return this.packageJSON[key];
    }
    async getSupportedNapiVersions() {
        const binary = (await this.packageJSONFieldWithDefault('binary', {}));
        return binary === null || binary === void 0 ? void 0 : binary.napi_versions;
    }
}
exports.NativeModule = NativeModule;
async function locateBinary(basePath, suffix) {
    let parentPath = basePath;
    let testPath;
    while (testPath !== parentPath) {
        testPath = parentPath;
        const checkPath = path_1.default.resolve(testPath, suffix);
        if (await fs_extra_1.default.pathExists(checkPath)) {
            return checkPath;
        }
        parentPath = path_1.default.resolve(testPath, '..');
    }
    return null;
}
exports.locateBinary = locateBinary;
//# sourceMappingURL=index.js.map