"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeAPI = void 0;
const node_api_version_1 = require("node-api-version");
class NodeAPI {
    constructor(moduleName, electronVersion) {
        this.moduleName = moduleName;
        this.electronVersion = electronVersion;
    }
    ensureElectronSupport() {
        this.getVersionForElectron();
    }
    getVersionForElectron() {
        const electronNapiVersion = (0, node_api_version_1.fromElectronVersion)(this.electronVersion);
        if (!electronNapiVersion) {
            throw new Error(`Native module '${this.moduleName}' requires Node-API but Electron v${this.electronVersion} does not support Node-API`);
        }
        return electronNapiVersion;
    }
    getNapiVersion(moduleNapiVersions) {
        const electronNapiVersion = this.getVersionForElectron();
        // Filter out Node-API versions that are too high
        const filteredVersions = moduleNapiVersions.filter((v) => (v <= electronNapiVersion));
        if (filteredVersions.length === 0) {
            throw new Error(`Native module '${this.moduleName}' supports Node-API versions ${moduleNapiVersions} but Electron v${this.electronVersion} only supports Node-API v${electronNapiVersion}`);
        }
        return Math.max(...filteredVersions);
    }
}
exports.NodeAPI = NodeAPI;
//# sourceMappingURL=node-api.js.map