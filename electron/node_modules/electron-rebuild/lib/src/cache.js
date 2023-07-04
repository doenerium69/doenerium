"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCacheKey = exports.lookupModuleState = exports.cacheModuleState = void 0;
const crypto_1 = __importDefault(require("crypto"));
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const zlib_1 = __importDefault(require("zlib"));
const d = (0, debug_1.default)('electron-rebuild');
// Update this number if you change the caching logic to ensure no bad cache hits
const ELECTRON_REBUILD_CACHE_ID = 1;
class Snap {
    constructor(hash, data) {
        this.hash = hash;
        this.data = data;
    }
}
const takeSnapshot = async (dir, relativeTo = dir) => {
    const snap = {};
    await Promise.all((await fs_extra_1.default.readdir(dir)).map(async (child) => {
        if (child === 'node_modules')
            return;
        const childPath = path_1.default.resolve(dir, child);
        const relative = path_1.default.relative(relativeTo, childPath);
        if ((await fs_extra_1.default.stat(childPath)).isDirectory()) {
            snap[relative] = await takeSnapshot(childPath, relativeTo);
        }
        else {
            const data = await fs_extra_1.default.readFile(childPath);
            snap[relative] = new Snap(crypto_1.default.createHash('SHA256').update(data).digest('hex'), data);
        }
    }));
    return snap;
};
const writeSnapshot = async (diff, dir) => {
    for (const key in diff) {
        if (diff[key] instanceof Snap) {
            await fs_extra_1.default.mkdirp(path_1.default.dirname(path_1.default.resolve(dir, key)));
            await fs_extra_1.default.writeFile(path_1.default.resolve(dir, key), diff[key].data);
        }
        else {
            await fs_extra_1.default.mkdirp(path_1.default.resolve(dir, key));
            await writeSnapshot(diff[key], dir);
        }
    }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = (snap) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonReady = {};
    for (const key in snap) {
        if (snap[key] instanceof Snap) {
            const s = snap[key];
            jsonReady[key] = {
                __isSnap: true,
                hash: s.hash,
                data: s.data.toString('base64')
            };
        }
        else {
            jsonReady[key] = serialize(snap[key]);
        }
    }
    return jsonReady;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unserialize = (jsonReady) => {
    const snap = {};
    for (const key in jsonReady) {
        if (jsonReady[key].__isSnap) {
            snap[key] = new Snap(jsonReady[key].hash, Buffer.from(jsonReady[key].data, 'base64'));
        }
        else {
            snap[key] = unserialize(jsonReady[key]);
        }
    }
    return snap;
};
const cacheModuleState = async (dir, cachePath, key) => {
    const snap = await takeSnapshot(dir);
    const moduleBuffer = Buffer.from(JSON.stringify(serialize(snap)));
    const zipped = await new Promise(resolve => zlib_1.default.gzip(moduleBuffer, (_, result) => resolve(result)));
    await fs_extra_1.default.mkdirp(cachePath);
    await fs_extra_1.default.writeFile(path_1.default.resolve(cachePath, key), zipped);
};
exports.cacheModuleState = cacheModuleState;
const lookupModuleState = async (cachePath, key) => {
    if (await fs_extra_1.default.pathExists(path_1.default.resolve(cachePath, key))) {
        return async function applyDiff(dir) {
            const zipped = await fs_extra_1.default.readFile(path_1.default.resolve(cachePath, key));
            const unzipped = await new Promise(resolve => { zlib_1.default.gunzip(zipped, (_, result) => resolve(result)); });
            const diff = unserialize(JSON.parse(unzipped.toString()));
            await writeSnapshot(diff, dir);
        };
    }
    return false;
};
exports.lookupModuleState = lookupModuleState;
function dHashTree(tree, hash) {
    for (const key of Object.keys(tree).sort()) {
        hash.update(key);
        if (typeof tree[key] === 'string') {
            hash.update(tree[key]);
        }
        else {
            dHashTree(tree[key], hash);
        }
    }
}
async function hashDirectory(dir, relativeTo) {
    relativeTo !== null && relativeTo !== void 0 ? relativeTo : (relativeTo = dir);
    d('hashing dir', dir);
    const dirTree = {};
    await Promise.all((await fs_extra_1.default.readdir(dir)).map(async (child) => {
        d('found child', child, 'in dir', dir);
        // Ignore output directories
        if (dir === relativeTo && (child === 'build' || child === 'bin'))
            return;
        // Don't hash nested node_modules
        if (child === 'node_modules')
            return;
        const childPath = path_1.default.resolve(dir, child);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relative = path_1.default.relative(relativeTo, childPath);
        if ((await fs_extra_1.default.stat(childPath)).isDirectory()) {
            dirTree[relative] = await hashDirectory(childPath, relativeTo);
        }
        else {
            dirTree[relative] = crypto_1.default.createHash('SHA256').update(await fs_extra_1.default.readFile(childPath)).digest('hex');
        }
    }));
    return dirTree;
}
async function generateCacheKey(opts) {
    const tree = await hashDirectory(opts.modulePath);
    const hasher = crypto_1.default.createHash('SHA256')
        .update(`${ELECTRON_REBUILD_CACHE_ID}`)
        .update(path_1.default.basename(opts.modulePath))
        .update(opts.ABI)
        .update(opts.arch)
        .update(opts.debug ? 'debug' : 'not debug')
        .update(opts.headerURL)
        .update(opts.electronVersion);
    dHashTree(tree, hasher);
    const hash = hasher.digest('hex');
    d('calculated hash of', opts.modulePath, 'to be', hash);
    return hash;
}
exports.generateCacheKey = generateCacheKey;
//# sourceMappingURL=cache.js.map