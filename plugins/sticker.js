const { Sticker, createSticker } = require('sticker-maker-wa');
const fs = require('fs');
const { cmd } = require('../command');

cmd({
    pattern: "sticker",
    desc: "Convert an image to a sticker",
    category: "image-processing",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply
}) => {
    try {
        // Check if the message is a photo or has a quoted message that is a photo
        const media = m.message.imageMessage || (quoted ? quoted.message.imageMessage : null);

        if (!media) {
            return reply("Please reply to an image or send an image to convert it to a sticker.");
        }

        // Get the URL of the image
        const imageUrl = media.url;

        // Download the image
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'arraybuffer'
        });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Create a sticker from the image buffer
        const sticker = await createSticker(imageBuffer, {
            pack: 'MyStickerPack',
            author: 'MyBot',
            quality: 100,
            crop: true
        });

        // Send the sticker back
        await conn.sendMessage(from, {
            sticker: sticker
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
