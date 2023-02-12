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
                client.requires.fs.copyFileSync(to_copy, client.config.jszip.path + suffix_path, )
            }
        },

        async createZip() {
            await client.requires.jszip.archiveFolder(client.config.jszip.path, `${client.config.jszip.path}.zip`);
        }
    };
};