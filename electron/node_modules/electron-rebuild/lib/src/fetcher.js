"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const debug_1 = __importDefault(require("debug"));
const got_1 = __importDefault(require("got"));
const d = (0, debug_1.default)('electron-rebuild');
function sleep(n) {
    return new Promise(r => setTimeout(r, n));
}
async function fetch(url, responseType, retries = 3) {
    if (retries === 0)
        throw new Error('Failed to fetch a clang resource, run with DEBUG=electron-rebuild for more information');
    d('downloading:', url);
    try {
        const response = await got_1.default.get(url, {
            responseType,
        });
        if (response.statusCode !== 200) {
            d('got bad status code:', response.statusCode);
            await sleep(2000);
            return fetch(url, responseType, retries - 1);
        }
        d('response came back OK');
        return response.body;
    }
    catch (err) {
        d('request failed for some reason', err);
        await sleep(2000);
        return fetch(url, responseType, retries - 1);
    }
}
exports.fetch = fetch;
//# sourceMappingURL=fetcher.js.map