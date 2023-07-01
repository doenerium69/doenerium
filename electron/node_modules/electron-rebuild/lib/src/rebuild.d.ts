/// <reference types="node" />
import { EventEmitter } from 'events';
import { BuildType, IRebuilder, RebuildMode } from './types';
import { ModuleType } from './module-walker';
export interface RebuildOptions {
    buildPath: string;
    electronVersion: string;
    arch?: string;
    extraModules?: string[];
    onlyModules?: string[] | null;
    force?: boolean;
    headerURL?: string;
    types?: ModuleType[];
    mode?: RebuildMode;
    debug?: boolean;
    useCache?: boolean;
    useElectronClang?: boolean;
    cachePath?: string;
    prebuildTagPrefix?: string;
    projectRootPath?: string;
    forceABI?: number;
    disablePreGypCopy?: boolean;
}
export interface RebuilderOptions extends RebuildOptions {
    lifecycle: EventEmitter;
}
export declare class Rebuilder implements IRebuilder {
    private ABIVersion;
    private moduleWalker;
    nodeGypPath: string;
    rebuilds: (() => Promise<void>)[];
    lifecycle: EventEmitter;
    buildPath: string;
    electronVersion: string;
    platform: string;
    arch: string;
    force: boolean;
    headerURL: string;
    mode: RebuildMode;
    debug: boolean;
    useCache: boolean;
    cachePath: string;
    prebuildTagPrefix: string;
    msvsVersion?: string;
    useElectronClang: boolean;
    disablePreGypCopy: boolean;
    constructor(options: RebuilderOptions);
    get ABI(): string;
    get buildType(): BuildType;
    rebuild(): Promise<void>;
    rebuildModuleAt(modulePath: string): Promise<void>;
}
export declare type RebuildResult = Promise<void> & {
    lifecycle: EventEmitter;
};
export declare function rebuild(options: RebuildOptions): RebuildResult;
