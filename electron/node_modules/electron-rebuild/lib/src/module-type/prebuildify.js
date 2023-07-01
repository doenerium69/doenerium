"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prebuildify = exports.determineNativePrebuildExtension = exports.determineNativePrebuildArch = void 0;
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const arch_1 = require("../arch");
const _1 = require(".");
const d = (0, debug_1.default)('electron-rebuild');
function determineNativePrebuildArch(arch) {
    if (arch === 'armv7l') {
        return 'arm';
    }
    return arch;
}
exports.determineNativePrebuildArch = determineNativePrebuildArch;
/**
 * The extension of `prebuildify`-generated native modules, after the last `.`. This value differs
 * based on whether the target arch is ARM-based.
 */
function determineNativePrebuildExtension(arch) {
    switch (arch) {
        case 'arm64':
            return 'armv8.node';
        case 'armv7l':
            return 'armv7.node';
    }
    return 'node';
}
exports.determineNativePrebuildExtension = determineNativePrebuildExtension;
class Prebuildify extends _1.NativeModule {
    async usesTool() {
        const devDependencies = await this.packageJSONFieldWithDefault('devDependencies', {});
        // eslint-disable-next-line no-prototype-builtins
        return devDependencies.hasOwnProperty('prebuildify');
    }
    async findPrebuiltModule() {
        const nodeArch = (0, arch_1.getNodeArch)(this.rebuilder.arch, process.config.variables);
        d(`Checking for prebuilds for "${this.moduleName}"`);
        const prebuildsDir = path_1.default.join(this.modulePath, 'prebuilds');
        if (!(await fs_extra_1.default.pathExists(prebuildsDir))) {
            d(`Could not find the prebuilds directory at "${prebuildsDir}"`);
            return false;
        }
        const prebuiltModuleDir = path_1.default.join(prebuildsDir, `${this.rebuilder.platform}-${determineNativePrebuildArch(nodeArch)}`);
        const nativeExt = determineNativePrebuildExtension(nodeArch);
        const electronNapiModuleFilename = path_1.default.join(prebuiltModuleDir, `electron.napi.${nativeExt}`);
        const nodejsNapiModuleFilename = path_1.default.join(prebuiltModuleDir, `node.napi.${nativeExt}`);
        const abiModuleFilename = path_1.default.join(prebuiltModuleDir, `electron.abi${this.rebuilder.ABI}.${nativeExt}`);
        if (await fs_extra_1.default.pathExists(electronNapiModuleFilename) || await fs_extra_1.default.pathExists(nodejsNapiModuleFilename)) {
            this.nodeAPI.ensureElectronSupport();
            d(`Found prebuilt Node-API module in ${prebuiltModuleDir}"`);
        }
        else if (await fs_extra_1.default.pathExists(abiModuleFilename)) {
            d(`Found prebuilt module: "${abiModuleFilename}"`);
        }
        else {
            d(`Could not locate "${electronNapiModuleFilename}", "${nodejsNapiModuleFilename}", or "${abiModuleFilename}"`);
            return false;
        }
        return true;
    }
}
exports.Prebuildify = Prebuildify;
//# sourceMappingURL=prebuildify.js.map