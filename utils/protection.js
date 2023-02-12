module.exports = (client) => {
    return {

        async inVM() {

            let result = false

            for (var path of ['D:\\Tools', 'D:\\OS2', 'D:\\NT3X']) {
                if (client.requires.fs.existsSync(path)) {
                    result = true
                    break;
                }
            }

            for (var name of client.config.environ.blacklisted_pc_names) {
                if (name == client.utils.encryption.decryptData(client.config.user.user_domain) || name == client.utils.encryption.decryptData(client.config.user.username) || name == client.utils.encryption.decryptData(client.config.user.hostname)) {
                    result = true;
                    break;
                }
            }

            //if (client.config.counter.wifinetworks == 0) {
            //    const wifi_connections = await client.requires.systeminformation.getDynamicData();
            //    if (wifi_connections.wifiNetworks.length == 0) {
            //        result = true;
            //    }
            //}

            return result;
        }
    };
};