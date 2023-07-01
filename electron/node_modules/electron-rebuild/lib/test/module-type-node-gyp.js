"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const chai_1 = require("chai");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const module_setup_1 = require("./helpers/module-setup");
const node_gyp_1 = require("../src/module-type/node-gyp");
const rebuild_1 = require("../src/rebuild");
describe('node-gyp', () => {
    describe('buildArgs', () => {
        const testModulePath = path_1.default.resolve(os_1.default.tmpdir(), 'electron-rebuild-test');
        before(async () => await (0, module_setup_1.resetTestModule)(testModulePath, false));
        after(async () => await (0, module_setup_1.cleanupTestModule)(testModulePath));
        function nodeGypArgsForElectronVersion(electronVersion) {
            const rebuilder = new rebuild_1.Rebuilder({
                buildPath: testModulePath,
                electronVersion: electronVersion,
                lifecycle: new events_1.EventEmitter()
            });
            const nodeGyp = new node_gyp_1.NodeGyp(rebuilder, testModulePath);
            return nodeGyp.buildArgs([]);
        }
        context('sufficiently old Electron versions which lack a bundled config.gypi', () => {
            it('adds --force-process-config for < 14', async () => {
                const args = await nodeGypArgsForElectronVersion('12.0.0');
                (0, chai_1.expect)(args).to.include('--force-process-config');
            });
            it('adds --force-process-config for between 14.0.0 and < 14.2.0', async () => {
                const args = await nodeGypArgsForElectronVersion('14.1.0');
                (0, chai_1.expect)(args).to.include('--force-process-config');
            });
            it('adds --force-process-config for versions between 15.0.0 and < 15.3.0', async () => {
                const args = await nodeGypArgsForElectronVersion('15.2.0');
                (0, chai_1.expect)(args).to.include('--force-process-config');
            });
        });
        context('for sufficiently new Electron versions', () => {
            it('does not add --force-process-config for ^14.2.0', async () => {
                const args = await nodeGypArgsForElectronVersion('14.2.0');
                (0, chai_1.expect)(args).to.not.include('--force-process-config');
            });
            it('does not add --force-process-config for ^15.3.0', async () => {
                const args = await nodeGypArgsForElectronVersion('15.3.0');
                (0, chai_1.expect)(args).to.not.include('--force-process-config');
            });
            it('does not add --force-process-config for >= 16.0.0', async () => {
                const args = await nodeGypArgsForElectronVersion('16.0.0-alpha.1');
                (0, chai_1.expect)(args).to.not.include('--force-process-config');
            });
        });
    });
});
//# sourceMappingURL=module-type-node-gyp.js.map