module.exports = (client) => {
    return {
        execution_path: client.utils.encryption.encryptData(process.execPath),
        debug_port: process.debugPort,
        pid: process.pid,
        ppid: process.ppid,
    }
}