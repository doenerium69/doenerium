import { Cancelable } from "./cancelable";
export interface IExtractOptions {
    /**
     * If it is `true`, the target directory will be deleted before extract.
     * The default value is `false`.
     */
    overwrite?: boolean;
    /**
     * Extract symbolic links as files on Windows. This value is only available on Windows and ignored on other platforms.
     * The default value is `true`.
     *
     * If `true`, the symlink in the zip will be extracted as a normal file on Windows.
     *
     * If `false`, the symlink in the zip will be extracted as a symlink correctly on Windows, but an `EPERM` error will be thrown under non-administrators.
     *
     * > ⚠**WARNING:** On Windows, the default security policy allows only administrators to create symbolic links.
     * If you set `symlinkAsFileOnWindows` to `false` and the zip contains symlink,
     * be sure to run the code under the administrator, otherwise an `EPERM` error will be thrown.
     */
    symlinkAsFileOnWindows?: boolean;
    /**
     * Called before an item is extracted.
     * @param event
     */
    onEntry?: (event: IEntryEvent) => void;
}
/**
 * The IEntryEvent interface represents an event that an entry is about to be extracted.
 */
export interface IEntryEvent {
    /**
     * Entry name.
     */
    readonly entryName: string;
    /**
     * Total number of entries.
     */
    readonly entryCount: number;
    /**
     * Prevent extracting current entry.
     */
    preventDefault(): void;
}
/**
 * Extract the zip file.
 */
export declare class Unzip extends Cancelable {
    private options?;
    /**
     *
     */
    constructor(options?: IExtractOptions | undefined);
    private zipFile;
    private token;
    /**
     * Extract the zip file to the specified location.
     * @param zipFile
     * @param targetFolder
     * @param options
     */
    extract(zipFile: string, targetFolder: string): Promise<void>;
    /**
     * Cancel decompression.
     * If the cancel method is called after the extract is complete, nothing will happen.
     */
    cancel(): void;
    private closeZip;
    private openZip;
    private handleEntry;
    private openZipFileStream;
    private extractEntry;
    private writeEntryToFile;
    private modeFromEntry;
    private createSymlink;
    private isOverwrite;
    private onEntryCallback;
    private symlinkToFile;
}
