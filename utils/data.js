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