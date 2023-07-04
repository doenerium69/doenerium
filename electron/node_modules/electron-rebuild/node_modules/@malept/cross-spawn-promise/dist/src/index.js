"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawn = exports.ExitSignalError = exports.ExitCodeError = exports.ExitError = exports.CrossSpawnError = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
function stringifyCommand(cmd, args) {
    if (args && Array.isArray(args) && args.length > 0) {
        return `${cmd} ${args.join(" ")}`;
    }
    else {
        return cmd;
    }
}
/**
 * Wrapper error for when the spawn function itself emits an error.
 */
class CrossSpawnError extends Error {
    constructor(cmd, args, originalError, stderr) {
        const fullCommand = stringifyCommand(cmd, args);
        const errorMessage = originalError.message || originalError;
        super(`Error executing command (${fullCommand}):\n${errorMessage}\n${stderr}`.trim());
        this.originalError = originalError;
    }
}
exports.CrossSpawnError = CrossSpawnError;
/**
 * Base error class for when a process does not exit with a status code of zero.
 */
class ExitError extends Error {
    constructor(cmd, args, message, stdout, stderr) {
        super(message);
        this.cmd = cmd;
        this.args = args;
        this.stdout = stdout;
        this.stderr = stderr;
    }
}
exports.ExitError = ExitError;
/**
 * The error thrown when a process emits a non-zero exit code.
 */
class ExitCodeError extends ExitError {
    constructor(cmd, args, code, stdout, stderr) {
        const fullCommand = stringifyCommand(cmd, args);
        super(cmd, args, `Command failed with a non-zero return code (${code}):\n${fullCommand}\n${stdout}\n${stderr}`.trim(), stdout, stderr);
        this.code = code;
    }
}
exports.ExitCodeError = ExitCodeError;
/**
 * The error thrown when a process exits via a signal.
 */
class ExitSignalError extends ExitError {
    constructor(cmd, args, signal, stdout, stderr) {
        const fullCommand = stringifyCommand(cmd, args);
        super(cmd, args, `Command terminated via a signal (${signal}):\n${fullCommand}\n${stdout}\n${stderr}`.trim(), stdout, stderr);
        this.signal = signal;
    }
}
exports.ExitSignalError = ExitSignalError;
/**
 * A wrapper around `cross-spawn`'s `spawn` function which can optionally log the command executed
 * and/or change the error object via a callback.
 *
 * @param cmd - The command to run
 */
async function spawn(cmd, args, options) {
    if (!options) {
        options = {};
    }
    const { logger, updateErrorCallback, ...spawnOptions } = options;
    if (logger)
        logger(`Executing command ${stringifyCommand(cmd, args)}`);
    return new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        const process = cross_spawn_1.default(cmd, args, spawnOptions);
        if (process.stdout) {
            process.stdout.on("data", (data) => {
                stdout += data.toString();
            });
        }
        if (process.stderr) {
            process.stderr.on("data", 
            /* istanbul ignore next */ (data) => {
                stderr += data.toString();
            });
        }
        process.on("close", (code, signal) => {
            if (code === 0) {
                resolve(stdout);
            }
            else if (code === null) {
                // Why: assume signal is not null if code is null
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                reject(new ExitSignalError(cmd, args, signal, stdout, stderr));
            }
            else {
                reject(new ExitCodeError(cmd, args, code, stdout, stderr));
            }
        });
        process.on("error", (err) => {
            if (updateErrorCallback) {
                updateErrorCallback(err, !!logger);
            }
            reject(new CrossSpawnError(cmd, args, err, stderr));
        });
    });
}
exports.spawn = spawn;
//# sourceMappingURL=index.js.map