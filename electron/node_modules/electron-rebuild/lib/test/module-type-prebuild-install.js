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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const events_1 = require("events");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const module_setup_1 = require("./helpers/module-setup");
const prebuild_install_1 = require("../src/module-type/prebuild-install");
const rebuild_1 = require("../src/rebuild");
chai_1.default.use(chai_as_promised_1.default);
const testModulePath = path_1.default.resolve(os_1.default.tmpdir(), 'electron-rebuild-test');
describe('prebuild-install', () => {
    const modulePath = path_1.default.join(testModulePath, 'node_modules', 'farmhash');
    const rebuilderArgs = {
        buildPath: testModulePath,
        electronVersion: '8.0.0',
        arch: process.arch,
        lifecycle: new events_1.EventEmitter()
    };
    before(() => {
        process.env.ELECTRON_REBUILD_TESTS = 'true';
    });
    describe('Node-API support', function () {
        this.timeout(module_setup_1.TIMEOUT_IN_MILLISECONDS);
        before(async () => await (0, module_setup_1.resetTestModule)(testModulePath));
        after(async () => await (0, module_setup_1.cleanupTestModule)(testModulePath));
        it('should find correct napi version and select napi args', async () => {
            const rebuilder = new rebuild_1.Rebuilder(rebuilderArgs);
            const prebuildInstall = new prebuild_install_1.PrebuildInstall(rebuilder, modulePath);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (0, chai_1.expect)(prebuildInstall.nodeAPI.getNapiVersion((await prebuildInstall.getSupportedNapiVersions()))).to.equal(3);
            (0, chai_1.expect)(await prebuildInstall.getPrebuildInstallRuntimeArgs()).to.deep.equal([
                '--runtime=napi',
                `--target=3`,
            ]);
        });
        it('should not fail running prebuild-install', async () => {
            const rebuilder = new rebuild_1.Rebuilder(rebuilderArgs);
            const prebuildInstall = new prebuild_install_1.PrebuildInstall(rebuilder, modulePath);
            (0, chai_1.expect)(await prebuildInstall.findPrebuiltModule()).to.equal(true);
        });
        it('should throw error with unsupported Electron version', async () => {
            const rebuilder = new rebuild_1.Rebuilder({
                ...rebuilderArgs,
                electronVersion: '2.0.0',
            });
            const prebuildInstall = new prebuild_install_1.PrebuildInstall(rebuilder, modulePath);
            (0, chai_1.expect)(prebuildInstall.findPrebuiltModule()).to.eventually.be.rejectedWith("Native module 'farmhash' requires Node-API but Electron v2.0.0 does not support Node-API");
        });
    });
    after(() => {
        delete process.env.ELECTRON_REBUILD_TESTS;
    });
});
//# sourceMappingURL=module-type-prebuild-install.js.map