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
exports.locateElectronModule = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const search_module_1 = require("./search-module");
const electronModuleNames = ['electron', 'electron-prebuilt-compile'];
async function locateModuleByRequire() {
    for (const moduleName of electronModuleNames) {
        try {
            const modulePath = path.resolve(require.resolve(path.join(moduleName, 'package.json')), '..');
            if (await fs.pathExists(path.join(modulePath, 'package.json'))) {
                return modulePath;
            }
        }
        catch { // eslint-disable-line no-empty
        }
    }
    return null;
}
async function locateElectronModule(projectRootPath = undefined, startDir = undefined) {
    startDir !== null && startDir !== void 0 ? startDir : (startDir = process.cwd());
    for (const moduleName of electronModuleNames) {
        const electronPaths = await (0, search_module_1.searchForModule)(startDir, moduleName, projectRootPath);
        const electronPath = electronPaths.find(async (ePath) => await fs.pathExists(path.join(ePath, 'package.json')));
        if (electronPath) {
            return electronPath;
        }
    }
    return locateModuleByRequire();
}
exports.locateElectronModule = locateElectronModule;
//# sourceMappingURL=electron-locator.js.map