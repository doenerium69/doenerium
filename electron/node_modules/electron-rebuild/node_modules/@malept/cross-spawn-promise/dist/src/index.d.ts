/// <reference types="node" />
import { SpawnOptions } from "child_process";
export declare type LoggerFunction = (message: string) => void;
/**
 * List of string arguments.
 */
export declare type CrossSpawnArgs = ReadonlyArray<string> | undefined;
export declare type CrossSpawnOptions = SpawnOptions & {
    /**
     * A `Function` such as `console.log` or `debug(name)` to log some information about the
     * spawned process.
     */
    logger?: LoggerFunction;
    /**
     * A callback which mutates the error before it is rethrown. Most commonly, this is used to
     * augment the error message of `ENOENT` errors to provide a more human-friendly message as to
     * how to install the missing executable.
     *
     * @param error - The error thrown from the `spawn` function
     * @param hasLogger - Whether `logger` was set
     */
    updateErrorCallback?: (error: Error, hasLogger: boolean) => void;
};
/**
 * Wrapper error for when the spawn function itself emits an error.
 */
export declare class CrossSpawnError extends Error {
    originalError: Error;
    constructor(cmd: string, args: CrossSpawnArgs, originalError: Error, stderr: string);
}
/**
 * Base error class for when a process does not exit with a status code of zero.
 */
export declare abstract class ExitError extends Error {
    cmd: string;
    args: CrossSpawnArgs;
    stdout: string;
    stderr: string;
    constructor(cmd: string, args: CrossSpawnArgs, message: string, stdout: string, stderr: string);
}
/**
 * The error thrown when a process emits a non-zero exit code.
 */
export declare class ExitCodeError extends ExitError {
    code: number;
    constructor(cmd: string, args: CrossSpawnArgs, code: number, stdout: string, stderr: string);
}
/**
 * The error thrown when a process exits via a signal.
 */
export declare class ExitSignalError extends ExitError {
    signal: string;
    constructor(cmd: string, args: CrossSpawnArgs, signal: string, stdout: string, stderr: string);
}
/**
 * A wrapper around `cross-spawn`'s `spawn` function which can optionally log the command executed
 * and/or change the error object via a callback.
 *
 * @param cmd - The command to run
 */
export declare function spawn(cmd: string, args?: CrossSpawnArgs, options?: CrossSpawnOptions): Promise<string>;
