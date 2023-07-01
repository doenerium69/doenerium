/// <reference types="node" />
import { Transform, TransformCallback } from 'stream';
export declare type AccumulateStreamOptions = {
    count?: number;
    size?: string;
    interval?: string;
    phrase?: string;
    custom?: {
        event: string;
        isDone: (this: AccumulateStream, chunk: Buffer, encoding: BufferEncoding) => boolean;
    };
    emitFlush?: boolean;
};
export declare type AccumulateStreamEvents = 'chunk' | 'count' | 'size' | 'interval' | 'phrase' | string;
export declare class AccumulateStream extends Transform {
    protected buffer: Buffer;
    protected chunksCounter: number;
    private readonly interval?;
    readonly options: AccumulateStreamOptions;
    constructor(options?: AccumulateStreamOptions);
    private reset;
    private accumulate;
    private drain;
    private emitEvent;
    _transform(chunk: Buffer, encoding: BufferEncoding, cb: TransformCallback): void;
    _flush(cb: TransformCallback): void;
    _final(cb: TransformCallback): void;
    isEmpty(): boolean;
    getBuffer(): Buffer;
}
