declare type ExpectRebuildOptions = {
    buildType?: string;
    metaShouldExist?: boolean;
};
export declare function expectNativeModuleToBeRebuilt(basePath: string, modulePath: string, options?: ExpectRebuildOptions): Promise<void>;
export declare function expectNativeModuleToNotBeRebuilt(basePath: string, modulePath: string, options?: ExpectRebuildOptions): Promise<void>;
export {};
