/// <reference types="node" />
import { EventEmitter } from 'events';
export declare enum BuildType {
    Debug = "Debug",
    Release = "Release"
}
export declare type RebuildMode = 'sequential' | 'parallel';
export interface IRebuilder {
    ABI: string;
    arch: string;
    buildPath: string;
    buildType: BuildType;
    cachePath: string;
    debug: boolean;
    disablePreGypCopy: boolean;
    electronVersion: string;
    force: boolean;
    headerURL: string;
    lifecycle: EventEmitter;
    mode: RebuildMode;
    msvsVersion?: string;
    platform: string;
    prebuildTagPrefix: string;
    useCache: boolean;
    useElectronClang: boolean;
}
