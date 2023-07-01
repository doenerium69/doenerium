import { NodeAPI } from '../node-api';
import { IRebuilder } from '../types';
declare type PackageJSONValue = string | Record<string, unknown>;
export declare class NativeModule {
    protected rebuilder: IRebuilder;
    private _moduleName;
    protected modulePath: string;
    nodeAPI: NodeAPI;
    private packageJSON;
    constructor(rebuilder: IRebuilder, modulePath: string);
    get moduleName(): string;
    packageJSONFieldWithDefault(key: string, defaultValue: PackageJSONValue): Promise<PackageJSONValue>;
    packageJSONField(key: string): Promise<PackageJSONValue | undefined>;
    getSupportedNapiVersions(): Promise<number[] | undefined>;
}
export declare function locateBinary(basePath: string, suffix: string): Promise<string | null>;
export {};
