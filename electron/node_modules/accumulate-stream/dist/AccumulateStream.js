"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccumulateStream = void 0;
const stream_1 = require("stream");
const ms_1 = __importDefault(require("ms"));
const bytes_1 = __importDefault(require("bytes"));
class AccumulateStream extends stream_1.Transform {
    constructor(options = {}) {
        var _a;
        super({
            decodeStrings: true,
            objectMode: false,
            autoDestroy: true,
            emitClose: true,
            allowHalfOpen: false,
        });
        this.options = options;
        this.reset();
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.interval) {
            this.interval = setInterval(() => {
                this.emitEvent('interval');
                this.drain();
            }, (0, ms_1.default)(this.options.interval));
        }
    }
    reset() {
        this.buffer = Buffer.from([]);
        this.chunksCounter = 0;
    }
    accumulate(chunk) {
        const newBufferLength = this.buffer.length + chunk.length;
        this.buffer = Buffer.concat([this.buffer, chunk], newBufferLength);
        this.chunksCounter += 1;
    }
    drain() {
        this.push(this.getBuffer());
        this.reset();
    }
    emitEvent(event, data = {}) {
        this.emit(event, Object.assign({ buffer: this.getBuffer() }, data));
    }
    _transform(chunk, encoding, cb) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.accumulate(chunk);
        this.emitEvent('chunk', { chunk });
        const isCountDone = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.count) && this.options.count <= this.chunksCounter;
        if (isCountDone) {
            this.emitEvent('count');
        }
        const isSizeDone = ((_b = this.options) === null || _b === void 0 ? void 0 : _b.size) && (0, bytes_1.default)(this.options.size) <= this.buffer.byteLength;
        if (isSizeDone) {
            this.emitEvent('size', { size: this.buffer.byteLength });
        }
        const isPhraseDone = ((_c = this.options) === null || _c === void 0 ? void 0 : _c.phrase) && this.buffer.includes(this.options.phrase);
        if (isPhraseDone) {
            this.emitEvent('phrase');
        }
        const isCustomDone = ((_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.custom) === null || _e === void 0 ? void 0 : _e.event) &&
            ((_g = (_f = this.options) === null || _f === void 0 ? void 0 : _f.custom) === null || _g === void 0 ? void 0 : _g.isDone) &&
            ((_k = (_j = (_h = this.options) === null || _h === void 0 ? void 0 : _h.custom) === null || _j === void 0 ? void 0 : _j.isDone) === null || _k === void 0 ? void 0 : _k.call(this, chunk, encoding));
        if (isCustomDone) {
            this.emitEvent((_m = (_l = this.options) === null || _l === void 0 ? void 0 : _l.custom) === null || _m === void 0 ? void 0 : _m.event);
        }
        const isDone = isSizeDone || isCountDone || isPhraseDone || isCustomDone;
        if (isDone) {
            this.drain();
        }
        return cb();
    }
    _flush(cb) {
        var _a;
        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.emitFlush) && !this.isEmpty()) {
            this.drain();
        }
        return cb();
    }
    _final(cb) {
        if (this.interval) {
            clearInterval(this.interval);
        }
        return cb();
    }
    isEmpty() {
        return this.buffer.length === 0;
    }
    getBuffer() {
        return this.buffer;
    }
}
exports.AccumulateStream = AccumulateStream;
//# sourceMappingURL=AccumulateStream.js.map