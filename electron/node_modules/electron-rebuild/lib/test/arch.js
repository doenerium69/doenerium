"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const arch_1 = require("../src/arch");
// Copied from @electron/get
describe('uname()', () => {
    if (process.platform !== 'win32') {
        it('should return the correct arch for your system', () => {
            // assumes that the tests will always be run on an x64 system 😬
            (0, chai_1.expect)((0, arch_1.uname)()).to.equal('x86_64');
        });
    }
});
// Based on getHostArch tests from @electron/get
describe('getNodeArch()', () => {
    it('should return process.arch on x64', () => {
        (0, chai_1.expect)((0, arch_1.getNodeArch)('x64', {})).to.equal('x64');
    });
    it('should return process.arch on ia32', () => {
        (0, chai_1.expect)((0, arch_1.getNodeArch)('ia32', {})).to.equal('ia32');
    });
    it('should return process.arch on arm64', () => {
        (0, chai_1.expect)((0, arch_1.getNodeArch)('arm64', {})).to.equal('arm64');
    });
    it('should return process.arch on unknown arm', () => {
        (0, chai_1.expect)((0, arch_1.getNodeArch)('arm', {})).to.equal('armv7l');
    });
    if (process.platform !== 'win32') {
        it('should return uname on arm 6', () => {
            (0, chai_1.expect)((0, arch_1.getNodeArch)('arm', { arm_version: '6' })).to.equal((0, arch_1.uname)());
        });
    }
    it('should return armv7l on arm 7', () => {
        (0, chai_1.expect)((0, arch_1.getNodeArch)('arm', { arm_version: '7' })).to.equal('armv7l');
    });
});
//# sourceMappingURL=arch.js.map