module.exports = (client) => {
    return {
        loadCPUS() {
            var _cpus = []

            client.requires.os.cpus().forEach((cpu) => {
                if (!_cpus.contains(cpu.model)) {
                    _cpus.push(cpu.model)
                    client.config.user.cpus.push(client.utils.encryption.encryptData(cpu.model.split("  ")[0]))
                }
            })
        },
    };
};