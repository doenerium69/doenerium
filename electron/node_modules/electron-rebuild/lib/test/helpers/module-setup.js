"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupTestModule = exports.resetTestModule = exports.resetMSVSVersion = exports.TIMEOUT_IN_MILLISECONDS = exports.MINUTES_IN_MILLISECONDS = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const cross_spawn_promise_1 = require("@malept/cross-spawn-promise");
const originalGypMSVSVersion = process.env.GYP_MSVS_VERSION;
const TIMEOUT_IN_MINUTES = process.platform === 'win32' ? 5 : 2;
exports.MINUTES_IN_MILLISECONDS = 60 * 1000;
exports.TIMEOUT_IN_MILLISECONDS = TIMEOUT_IN_MINUTES * exports.MINUTES_IN_MILLISECONDS;
function resetMSVSVersion() {
    if (originalGypMSVSVersion) {
        process.env.GYP_MSVS_VERSION = originalGypMSVSVersion;
    }
}
exports.resetMSVSVersion = resetMSVSVersion;
async function resetTestModule(testModulePath, installModules = true) {
    await fs_extra_1.default.remove(testModulePath);
    await fs_extra_1.default.mkdir(testModulePath, { recursive: true });
    await fs_extra_1.default.copyFile(path_1.default.resolve(__dirname, '../../test/fixture/native-app1/package.json'), path_1.default.resolve(testModulePath, 'package.json'));
    if (installModules) {
        await (0, cross_spawn_promise_1.spawn)('npm', ['install'], { cwd: testModulePath });
    }
    resetMSVSVersion();
}
exports.resetTestModule = resetTestModule;
async function cleanupTestModule(testModulePath) {
    await fs_extra_1.default.remove(testModulePath);
    resetMSVSVersion();
}
exports.cleanupTestModule = cleanupTestModule;
//# sourceMappingURL=module-setup.js.map