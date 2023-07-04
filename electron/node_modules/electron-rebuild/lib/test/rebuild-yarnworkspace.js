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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const cross_spawn_promise_1 = require("@malept/cross-spawn-promise");
const rebuild_1 = require("./helpers/rebuild");
const electron_version_1 = require("./helpers/electron-version");
const search_module_1 = require("../src/search-module");
const rebuild_2 = require("../src/rebuild");
const testElectronVersion = (0, electron_version_1.getExactElectronVersionSync)();
describe('rebuild for yarn workspace', function () {
    this.timeout(2 * 60 * 1000);
    const testModulePath = path.resolve(os.tmpdir(), 'electron-rebuild-test');
    const msvs_version = process.env.GYP_MSVS_VERSION;
    describe('core behavior', () => {
        before(async () => {
            await fs.remove(testModulePath);
            await fs.copy(path.resolve(__dirname, 'fixture/workspace-test'), testModulePath);
            await (0, cross_spawn_promise_1.spawn)('yarn', [], { cwd: testModulePath });
            if (msvs_version) {
                process.env.GYP_MSVS_VERSION = msvs_version;
            }
            const projectRootPath = await (0, search_module_1.getProjectRootPath)(path.join(testModulePath, 'workspace-test', 'child-workspace'));
            await (0, rebuild_2.rebuild)({
                buildPath: path.resolve(testModulePath, 'child-workspace'),
                electronVersion: testElectronVersion,
                arch: process.arch,
                projectRootPath
            });
        });
        it('should have rebuilt top level prod dependencies', async () => {
            await (0, rebuild_1.expectNativeModuleToBeRebuilt)(testModulePath, 'snappy');
        });
        it('should not have rebuilt top level devDependencies', async () => {
            await (0, rebuild_1.expectNativeModuleToNotBeRebuilt)(testModulePath, 'sleep');
        });
        after(async () => {
            await fs.remove(testModulePath);
            if (msvs_version) {
                process.env.GYP_MSVS_VERSION = msvs_version;
            }
        });
    });
});
//# sourceMappingURL=rebuild-yarnworkspace.js.map