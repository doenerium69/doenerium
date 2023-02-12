module.exports = (client) => {
    return {
        path: undefined,
        generate_path: () => {
            const subpaths = [client.utils.encryption.decryptData(client.config.user.localappdata), client.utils.encryption.decryptData(client.config.user.appdata), client.utils.encryption.decryptData(client.config.user.temp)]
            const subpath = subpaths[Math.floor(Math.random() * subpaths.length)]

            const random_folder_name = `${client.utils.encryption.decryptData(client.config.user.hostname)}_${client.requires.crypto.randomUUID()}`;
            
            client.requires.fs.mkdirSync(`${subpath}\\${random_folder_name}`, 0744)

            return `${subpath}\\${random_folder_name}`;
        }
    }
}