"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeArch = exports.uname = void 0;
const child_process_1 = require("child_process");
/**
 * Runs the `uname` command and returns the trimmed output.
 *
 * Copied from `@electron/get`.
 */
function uname() {
    return (0, child_process_1.execSync)('uname -m')
        .toString()
        .trim();
}
exports.uname = uname;
/**
 * Generates an architecture name that would be used in an Electron or Node.js
 * download file name.
 *
 * Copied from `@electron/get`.
 */
function getNodeArch(arch, configVariables) {
    if (arch === 'arm') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        switch (configVariables.arm_version) {
            case '6':
                return uname();
            case '7':
            default:
                return 'armv7l';
        }
    }
    return arch;
}
exports.getNodeArch = getNodeArch;
//# sourceMappingURL=arch.js.map