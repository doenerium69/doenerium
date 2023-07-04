import { NativeModule } from '.';
export declare class NodeGyp extends NativeModule {
    buildArgs(prefixedArgs: string[]): Promise<string[]>;
    buildArgsFromBinaryField(): Promise<string[]>;
    rebuildModule(): Promise<void>;
    private restoreEnv;
}
