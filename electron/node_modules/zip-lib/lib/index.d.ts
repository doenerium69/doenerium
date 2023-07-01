import { IZipOptions } from "./zip";
import { IExtractOptions } from "./unzip";
export * from "./zip";
export * from "./unzip";
/**
 * Compress a single file to zip.
 * @param file
 * @param zipFile the zip file path.
 * @param options
 */
export declare function archiveFile(file: string, zipFile: string, options?: IZipOptions): Promise<void>;
/**
 * Compress all the contents of the specified folder to zip.
 * @param folder
 * @param zipFile the zip file path.
 * @param options
 */
export declare function archiveFolder(folder: string, zipFile: string, options?: IZipOptions): Promise<void>;
/**
 * Extract the zip file to the specified location.
 * @param zipFile
 * @param targetFolder
 * @param options
 */
export declare function extract(zipFile: string, targetFolder: string, options?: IExtractOptions): Promise<void>;
