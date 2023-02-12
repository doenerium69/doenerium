module.exports = (client) => {
    return {
        version: client.utils.encryption.encryptData("1.0"),
        start_delay: 0
    }
}