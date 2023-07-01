"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const chai_1 = require("chai");
const path_1 = __importDefault(require("path"));
const prebuildify_1 = require("../src/module-type/prebuildify");
const rebuild_1 = require("../src/rebuild");
describe('determineNativePrebuildArch', () => {
    it('returns arm if passed in armv7l', () => {
        (0, chai_1.expect)((0, prebuildify_1.determineNativePrebuildArch)('armv7l')).to.equal('arm');
    });
    it('returns the input arch if the input is not armv7l', () => {
        (0, chai_1.expect)((0, prebuildify_1.determineNativePrebuildArch)('x64')).to.equal('x64');
    });
});
describe('determineNativePrebuildExtension', () => {
    it('returns armv8 suffix for an arm64 arch', () => {
        (0, chai_1.expect)((0, prebuildify_1.determineNativePrebuildExtension)('arm64')).to.equal('armv8.node');
    });
    it('returns armv7 suffix for an armv7l arch', () => {
        (0, chai_1.expect)((0, prebuildify_1.determineNativePrebuildExtension)('armv7l')).to.equal('armv7.node');
    });
    it('returns no suffix for non-ARM arches', () => {
        (0, chai_1.expect)((0, prebuildify_1.determineNativePrebuildExtension)('x64')).to.equal('node');
    });
});
describe('prebuildify', () => {
    const fixtureBaseDir = path_1.default.join(__dirname, 'fixture', 'prebuildify');
    const rebuilderArgs = {
        buildPath: 'nonexistent-path',
        electronVersion: '13.0.0',
        arch: 'x64',
        lifecycle: new events_1.EventEmitter()
    };
    const createRebuilder = (args = {}) => {
        const rebuilder = new rebuild_1.Rebuilder({ ...rebuilderArgs, ...args });
        rebuilder.platform = 'linux';
        return rebuilder;
    };
    describe('usesTool', () => {
        it('succeeds if prebuildify exists in devDependencies', async () => {
            const rebuilder = createRebuilder();
            const prebuildify = new prebuildify_1.Prebuildify(rebuilder, path_1.default.join(fixtureBaseDir, 'has-prebuildify-devdep'));
            (0, chai_1.expect)(await prebuildify.usesTool()).to.equal(true);
        });
        it('fails if prebuildify does not exist in devDependencies', async () => {
            const rebuilder = createRebuilder();
            const prebuildify = new prebuildify_1.Prebuildify(rebuilder, path_1.default.join(fixtureBaseDir, 'no-prebuildify-devdep'));
            (0, chai_1.expect)(await prebuildify.usesTool()).to.equal(false);
        });
    });
    describe('findPrebuiltModule', () => {
        describe('with no prebuilds directory', () => {
            it('should not find a prebuilt native module', async () => {
                const noPrebuildsDir = __dirname;
                const rebuilder = createRebuilder();
                const prebuildify = new prebuildify_1.Prebuildify(rebuilder, noPrebuildsDir);
                (0, chai_1.expect)(await prebuildify.findPrebuiltModule()).to.equal(false);
            });
        });
        describe('with prebuilt module for the given ABI', async () => {
            it('should find a prebuilt native module for x64/electron', async () => {
                const fixtureDir = path_1.default.join(fixtureBaseDir, 'abi');
                const rebuilder = createRebuilder();
                const prebuildify = new prebuildify_1.Prebuildify(rebuilder, fixtureDir);
                (0, chai_1.expect)(await prebuildify.findPrebuiltModule()).to.equal(true);
            });
        });
        describe('with prebuilt Node-API module', async () => {
            it('should find a prebuilt native module for x64/node', async () => {
                const fixtureDir = path_1.default.join(fixtureBaseDir, 'napi');
                const rebuilder = createRebuilder();
                const prebuildify = new prebuildify_1.Prebuildify(rebuilder, fixtureDir);
                (0, chai_1.expect)(await prebuildify.findPrebuiltModule()).to.equal(true);
            });
            it('should find a prebuilt native module for armv7l/node', async () => {
                const fixtureDir = path_1.default.join(fixtureBaseDir, 'napi');
                const rebuilder = createRebuilder({ arch: 'armv7l' });
                const prebuildify = new prebuildify_1.Prebuildify(rebuilder, fixtureDir);
                (0, chai_1.expect)(await prebuildify.findPrebuiltModule()).to.equal(true);
            });
            it('should find a prebuilt native module for arm64/electron', async () => {
                const fixtureDir = path_1.default.join(fixtureBaseDir, 'napi');
                const rebuilder = createRebuilder({ arch: 'arm64' });
                const prebuildify = new prebuildify_1.Prebuildify(rebuilder, fixtureDir);
                (0, chai_1.expect)(await prebuildify.findPrebuiltModule()).to.equal(true);
            });
        });
        describe('when it cannot find a prebuilt module', async () => {
            it('should not find a prebuilt native module', async () => {
                const fixtureDir = path_1.default.join(fixtureBaseDir, 'not-found');
                const rebuilder = createRebuilder();
                const prebuildify = new prebuildify_1.Prebuildify(rebuilder, fixtureDir);
                (0, chai_1.expect)(await prebuildify.findPrebuiltModule()).to.equal(false);
            });
        });
    });
});
//# sourceMappingURL=module-type-prebuildify.js.map