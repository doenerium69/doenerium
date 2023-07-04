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
exports.getClangEnvironmentVars = void 0;
const cp = __importStar(require("child_process"));
const debug_1 = __importDefault(require("debug"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const semver_1 = __importDefault(require("semver"));
const tar = __importStar(require("tar"));
const zlib = __importStar(require("zlib"));
const constants_1 = require("./constants");
const fetcher_1 = require("./fetcher");
const sysroot_fetcher_1 = require("./sysroot-fetcher");
const d = (0, debug_1.default)('electron-rebuild');
const CDS_URL = 'https://commondatastorage.googleapis.com/chromium-browser-clang';
function getPlatformUrlPrefix(hostOS) {
    const prefixMap = {
        'linux': 'Linux_x64',
        'darwin': 'Mac',
        'win32': 'Win',
    };
    return CDS_URL + '/' + prefixMap[hostOS] + '/';
}
function getClangDownloadURL(packageFile, packageVersion, hostOS) {
    const cdsFile = `${packageFile}-${packageVersion}.tgz`;
    return getPlatformUrlPrefix(hostOS) + cdsFile;
}
function getSDKRoot() {
    if (process.env.SDKROOT)
        return process.env.SDKROOT;
    const output = cp.execFileSync('xcrun', ['--sdk', 'macosx', '--show-sdk-path']);
    return output.toString().trim();
}
async function getClangEnvironmentVars(electronVersion, targetArch) {
    const clangDownloadDir = await downloadClangVersion(electronVersion);
    const clangDir = path.resolve(clangDownloadDir, 'bin');
    const cxxflags = [];
    const clangArgs = [];
    if (process.platform === 'darwin') {
        clangArgs.push('-isysroot', getSDKRoot());
    }
    if (semver_1.default.major(electronVersion) >= 20) {
        cxxflags.push('-std=c++17');
    }
    const gypArgs = [];
    if (process.platform === 'win32') {
        console.log(fs.readdirSync(clangDir));
        gypArgs.push(`/p:CLToolExe=clang-cl.exe`, `/p:CLToolPath=${clangDir}`);
    }
    if (process.platform === 'linux') {
        const sysrootPath = await (0, sysroot_fetcher_1.downloadLinuxSysroot)(electronVersion, targetArch);
        clangArgs.push('--sysroot', sysrootPath);
    }
    return {
        env: {
            CC: `"${path.resolve(clangDir, 'clang')}" ${clangArgs.join(' ')}`,
            CXX: `"${path.resolve(clangDir, 'clang++')}" ${clangArgs.join(' ')}`,
            CFLAGS: `${cxxflags.join(' ')}`,
            CXXFLAGS: `${cxxflags.join(' ')}`
        },
        args: gypArgs,
    };
}
exports.getClangEnvironmentVars = getClangEnvironmentVars;
function clangVersionFromRevision(update) {
    const regex = /CLANG_REVISION = '([^']+)'\nCLANG_SUB_REVISION = (\d+)\n/g;
    const clangVersionMatch = regex.exec(update);
    if (!clangVersionMatch)
        return null;
    const [, clangVersion, clangSubRevision] = clangVersionMatch;
    return `${clangVersion}-${clangSubRevision}`;
}
function clangVersionFromSVN(update) {
    const regex = /CLANG_REVISION = '([^']+)'\nCLANG_SVN_REVISION = '([^']+)'\nCLANG_SUB_REVISION = (\d+)\n/g;
    const clangVersionMatch = regex.exec(update);
    if (!clangVersionMatch)
        return null;
    const [, clangVersion, clangSvn, clangSubRevision] = clangVersionMatch;
    return `${clangSvn}-${clangVersion.substr(0, 8)}-${clangSubRevision}`;
}
async function downloadClangVersion(electronVersion) {
    d('fetching clang for Electron:', electronVersion);
    const clangDirPath = path.resolve(constants_1.ELECTRON_GYP_DIR, `${electronVersion}-clang`);
    if (await fs.pathExists(path.resolve(clangDirPath, 'bin', 'clang')))
        return clangDirPath;
    if (!await fs.pathExists(constants_1.ELECTRON_GYP_DIR))
        await fs.mkdirp(constants_1.ELECTRON_GYP_DIR);
    const electronDeps = await (0, fetcher_1.fetch)(`https://raw.githubusercontent.com/electron/electron/v${electronVersion}/DEPS`, 'text');
    const chromiumRevisionExtractor = /'chromium_version':\n\s+'([^']+)/g;
    const chromiumRevisionMatch = chromiumRevisionExtractor.exec(electronDeps);
    if (!chromiumRevisionMatch)
        throw new Error('Failed to determine Chromium revision for given Electron version');
    const chromiumRevision = chromiumRevisionMatch[1];
    d('fetching clang for Chromium:', chromiumRevision);
    const base64ClangUpdate = await (0, fetcher_1.fetch)(`https://chromium.googlesource.com/chromium/src.git/+/${chromiumRevision}/tools/clang/scripts/update.py?format=TEXT`, 'text');
    const clangUpdate = Buffer.from(base64ClangUpdate, 'base64').toString('utf8');
    const clangVersionString = clangVersionFromRevision(clangUpdate) || clangVersionFromSVN(clangUpdate);
    if (!clangVersionString)
        throw new Error('Failed to determine Clang revision from Electron version');
    d('fetching clang:', clangVersionString);
    const clangDownloadURL = getClangDownloadURL('clang', clangVersionString, process.platform);
    const contents = await (0, fetcher_1.fetch)(clangDownloadURL, 'buffer');
    d('deflating clang');
    zlib.deflateSync(contents);
    const tarPath = path.resolve(constants_1.ELECTRON_GYP_DIR, `${electronVersion}-clang.tar`);
    if (await fs.pathExists(tarPath))
        await fs.remove(tarPath);
    await fs.writeFile(tarPath, Buffer.from(contents));
    await fs.mkdirp(clangDirPath);
    d('tar running on clang');
    await tar.x({
        file: tarPath,
        cwd: clangDirPath,
    });
    await fs.remove(tarPath);
    d('cleaning up clang tar file');
    return clangDirPath;
}
//# sourceMappingURL=clang-fetcher.js.map