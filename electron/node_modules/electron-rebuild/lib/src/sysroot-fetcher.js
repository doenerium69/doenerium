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
exports.downloadLinuxSysroot = void 0;
const crypto = __importStar(require("crypto"));
const debug_1 = __importDefault(require("debug"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const tar = __importStar(require("tar"));
const constants_1 = require("./constants");
const fetcher_1 = require("./fetcher");
const d = (0, debug_1.default)('electron-rebuild');
const sysrootArchAliases = {
    x64: 'amd64',
    ia32: 'i386',
};
const SYSROOT_BASE_URL = 'https://s3.amazonaws.com/electronjs-sysroots/toolchain';
async function downloadLinuxSysroot(electronVersion, targetArch) {
    d('fetching sysroot for Electron:', electronVersion);
    const sysrootDir = path.resolve(constants_1.ELECTRON_GYP_DIR, `${electronVersion}-sysroot`);
    if (await fs.pathExists(path.resolve(sysrootDir, 'lib')))
        return sysrootDir;
    if (!await fs.pathExists(sysrootDir))
        await fs.mkdirp(sysrootDir);
    const linuxArch = sysrootArchAliases[targetArch] || targetArch;
    const electronSysroots = JSON.parse(await (0, fetcher_1.fetch)(`https://raw.githubusercontent.com/electron/electron/v${electronVersion}/script/sysroots.json`, 'text'));
    const { Sha1Sum: sha, Tarball: fileName } = electronSysroots[`sid_${linuxArch}`];
    const sysrootURL = `${SYSROOT_BASE_URL}/${sha}/${fileName}`;
    let sysrootBuffer = await (0, fetcher_1.fetch)(sysrootURL, 'buffer');
    const actualSha = crypto.createHash('SHA1').update(sysrootBuffer).digest('hex');
    d('expected sha:', sha);
    d('actual sha:', actualSha);
    if (sha !== actualSha)
        throw new Error(`Attempted to download the linux sysroot for ${electronVersion} but the SHA checksum did not match`);
    d('decompressing sysroot');
    sysrootBuffer = await new Promise(resolve => require('lzma-native').decompress(sysrootBuffer, undefined, (result) => resolve(result))); // eslint-disable-line
    const tmpTarFile = path.resolve(constants_1.ELECTRON_GYP_DIR, `${electronVersion}-${fileName}`);
    if (await fs.pathExists(tmpTarFile))
        await fs.remove(tmpTarFile);
    await fs.writeFile(tmpTarFile, sysrootBuffer);
    d('extracting sysroot');
    await tar.x({
        file: tmpTarFile,
        cwd: sysrootDir,
    });
    return sysrootDir;
}
exports.downloadLinuxSysroot = downloadLinuxSysroot;
//# sourceMappingURL=sysroot-fetcher.js.map