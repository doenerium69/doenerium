"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrebuildInstall = void 0;
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const cross_spawn_promise_1 = require("@malept/cross-spawn-promise");
const _1 = require(".");
const d = (0, debug_1.default)('electron-rebuild');
class PrebuildInstall extends _1.NativeModule {
    async usesTool() {
        const dependencies = await this.packageJSONFieldWithDefault('dependencies', {});
        // eslint-disable-next-line no-prototype-builtins
        return dependencies.hasOwnProperty('prebuild-install');
    }
    async locateBinary() {
        return (0, _1.locateBinary)(this.modulePath, 'node_modules/prebuild-install/bin.js');
    }
    async run(prebuildInstallPath) {
        const shimExt = process.env.ELECTRON_REBUILD_TESTS ? 'ts' : 'js';
        const executable = process.env.ELECTRON_REBUILD_TESTS ? path_1.default.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'ts-node') : process.execPath;
        await (0, cross_spawn_promise_1.spawn)(executable, [
            path_1.default.resolve(__dirname, '..', `prebuild-shim.${shimExt}`),
            prebuildInstallPath,
            `--arch=${this.rebuilder.arch}`,
            `--platform=${this.rebuilder.platform}`,
            `--tag-prefix=${this.rebuilder.prebuildTagPrefix}`,
            ...await this.getPrebuildInstallRuntimeArgs(),
        ], {
            cwd: this.modulePath,
        });
    }
    async findPrebuiltModule() {
        var _a;
        const prebuildInstallPath = await this.locateBinary();
        if (prebuildInstallPath) {
            d(`triggering prebuild download step: ${this.moduleName}`);
            try {
                await this.run(prebuildInstallPath);
                return true;
            }
            catch (err) {
                d('failed to use prebuild-install:', err);
                if ((_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.includes('requires Node-API but Electron')) {
                    throw err;
                }
            }
        }
        else {
            d(`could not find prebuild-install relative to: ${this.modulePath}`);
        }
        return false;
    }
    /**
     * Whether a prebuild-install-based native module exists.
     */
    async prebuiltModuleExists() {
        return fs_extra_1.default.pathExists(path_1.default.resolve(this.modulePath, 'prebuilds', `${this.rebuilder.platform}-${this.rebuilder.arch}`, `electron-${this.rebuilder.ABI}.node`));
    }
    async getPrebuildInstallRuntimeArgs() {
        const moduleNapiVersions = await this.getSupportedNapiVersions();
        if (moduleNapiVersions) {
            const napiVersion = this.nodeAPI.getNapiVersion(moduleNapiVersions);
            return [
                '--runtime=napi',
                `--target=${napiVersion}`,
            ];
        }
        else {
            return [
                '--runtime=electron',
                `--target=${this.rebuilder.electronVersion}`,
            ];
        }
    }
}
exports.PrebuildInstall = PrebuildInstall;
//# sourceMappingURL=prebuild-install.js.map