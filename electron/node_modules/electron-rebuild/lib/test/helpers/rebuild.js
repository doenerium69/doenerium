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
exports.expectNativeModuleToNotBeRebuilt = exports.expectNativeModuleToBeRebuilt = void 0;
const chai_1 = require("chai");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
async function expectNativeModuleToBeRebuilt(basePath, modulePath, options = {}) {
    const metaShouldExist = Object.prototype.hasOwnProperty.call(options, 'metaShouldExist') ? options.metaShouldExist : true;
    const message = `${path.basename(modulePath)} build meta should ${metaShouldExist ? '' : 'not '}exist`;
    const buildType = options.buildType || 'Release';
    const metaPath = path.resolve(basePath, 'node_modules', modulePath, 'build', buildType, '.forge-meta');
    (0, chai_1.expect)(await fs.pathExists(metaPath), message).to.equal(metaShouldExist);
}
exports.expectNativeModuleToBeRebuilt = expectNativeModuleToBeRebuilt;
async function expectNativeModuleToNotBeRebuilt(basePath, modulePath, options = {}) {
    await expectNativeModuleToBeRebuilt(basePath, modulePath, { ...options, metaShouldExist: false });
}
exports.expectNativeModuleToNotBeRebuilt = expectNativeModuleToNotBeRebuilt;
//# sourceMappingURL=rebuild.js.map