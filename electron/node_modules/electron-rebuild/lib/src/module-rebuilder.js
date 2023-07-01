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
exports.ModuleRebuilder = void 0;
const debug_1 = __importDefault(require("debug"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const cache_1 = require("./cache");
const node_gyp_1 = require("./module-type/node-gyp");
const prebuildify_1 = require("./module-type/prebuildify");
const prebuild_install_1 = require("./module-type/prebuild-install");
const d = (0, debug_1.default)('electron-rebuild');
class ModuleRebuilder {
    constructor(rebuilder, modulePath) {
        this.modulePath = modulePath;
        this.rebuilder = rebuilder;
        this.nodeGyp = new node_gyp_1.NodeGyp(rebuilder, modulePath);
        this.prebuildify = new prebuildify_1.Prebuildify(rebuilder, modulePath);
        this.prebuildInstall = new prebuild_install_1.PrebuildInstall(rebuilder, modulePath);
    }
    get metaPath() {
        return path.resolve(this.modulePath, 'build', this.rebuilder.buildType, '.forge-meta');
    }
    get metaData() {
        return `${this.rebuilder.arch}--${this.rebuilder.ABI}`;
    }
    async alreadyBuiltByRebuild() {
        if (await fs.pathExists(this.metaPath)) {
            const meta = await fs.readFile(this.metaPath, 'utf8');
            return meta === this.metaData;
        }
        return false;
    }
    async cacheModuleState(cacheKey) {
        if (this.rebuilder.useCache) {
            await (0, cache_1.cacheModuleState)(this.modulePath, this.rebuilder.cachePath, cacheKey);
        }
    }
    /**
     * Whether a prebuild-install-generated native module exists.
     */
    async prebuildInstallNativeModuleExists() {
        return this.prebuildInstall.prebuiltModuleExists();
    }
    /**
     * If the native module uses prebuildify, check to see if it comes with a prebuilt module for
     * the given platform and arch.
     */
    async findPrebuildifyModule(cacheKey) {
        if (await this.prebuildify.usesTool()) {
            d(`assuming is prebuildify powered: ${this.prebuildify.moduleName}`);
            if (await this.prebuildify.findPrebuiltModule()) {
                await this.writeMetadata();
                await this.cacheModuleState(cacheKey);
                return true;
            }
        }
        return false;
    }
    async findPrebuildInstallModule(cacheKey) {
        if (await this.prebuildInstall.usesTool()) {
            d(`assuming is prebuild-install powered: ${this.prebuildInstall.moduleName}`);
            if (await this.prebuildInstall.findPrebuiltModule()) {
                d('installed prebuilt module:', this.prebuildInstall.moduleName);
                await this.writeMetadata();
                await this.cacheModuleState(cacheKey);
                return true;
            }
        }
        return false;
    }
    async rebuildNodeGypModule(cacheKey) {
        await this.nodeGyp.rebuildModule();
        d('built via node-gyp:', this.nodeGyp.moduleName);
        await this.writeMetadata();
        await this.replaceExistingNativeModule();
        await this.cacheModuleState(cacheKey);
        return true;
    }
    async replaceExistingNativeModule() {
        const buildLocation = path.resolve(this.modulePath, 'build', this.rebuilder.buildType);
        d('searching for .node file', buildLocation);
        const buildLocationFiles = await fs.readdir(buildLocation);
        d('testing files', buildLocationFiles);
        const nodeFile = buildLocationFiles.find((file) => file !== '.node' && file.endsWith('.node'));
        const nodePath = nodeFile ? path.resolve(buildLocation, nodeFile) : undefined;
        if (nodePath && await fs.pathExists(nodePath)) {
            d('found .node file', nodePath);
            if (!this.rebuilder.disablePreGypCopy) {
                const abiPath = path.resolve(this.modulePath, `bin/${this.rebuilder.platform}-${this.rebuilder.arch}-${this.rebuilder.ABI}`);
                d('copying to prebuilt place:', abiPath);
                await fs.mkdir(abiPath, { recursive: true });
                await fs.copyFile(nodePath, path.join(abiPath, `${this.nodeGyp.moduleName}.node`));
            }
        }
    }
    async writeMetadata() {
        await fs.outputFile(this.metaPath, this.metaData);
    }
    async rebuild(cacheKey) {
        return (await this.findPrebuildifyModule(cacheKey)) ||
            (await this.findPrebuildInstallModule(cacheKey)) ||
            (await this.rebuildNodeGypModule(cacheKey));
    }
}
exports.ModuleRebuilder = ModuleRebuilder;
//# sourceMappingURL=module-rebuilder.js.map