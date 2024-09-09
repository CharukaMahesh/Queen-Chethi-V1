const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const axios = require('axios'); // Use axios to download the image

cmd({
    pattern: "sticker",
    desc: "Convert image to sticker",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // React with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        // Check if the message is replying to an image
        if (!quoted || !quoted.imageMessage) {
            return reply("Please reply to an image to convert it to a sticker.");
        }

        // Get media key and message ID
        const mediaKey = quoted.imageMessage.mediaKey;
        const mediaUrl = quoted.imageMessage.url;

        // Download the image
        const imageBuffer = await axios.get(mediaUrl, { responseType: 'arraybuffer' });

        if (!imageBuffer) {
            return reply("Failed to download the image. Please try again.");
        }

        // Create a sticker from the image
        const sticker = new Sticker(imageBuffer.data, {
            pack: 'Queen Chethi', // Sticker pack name
            author: 'Your Bot', // Sticker author name
            type: StickerTypes.FULL, // Sticker type (FULL, CROPPED, CIRCLE)
            categories: ['🤖', '🎉'], // Sticker emoji categories
            id: '12345', // Unique ID for the sticker
            quality: 70, // Quality of the sticker
        });

        // Convert to buffer and send sticker
        const stickerBuffer = await sticker.toBuffer();
        if (stickerBuffer) {
            await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

            // React with 📡 when the sticker is successfully sent
            await conn.sendMessage(from, {
                react: { text: "📡", key: mek.key }
            });
        } else {
            return reply("Failed to create sticker. Please try again.");
        }

    } catch (e) {
        console.error("Error:", e);

        // React with 😞 in case of an error
        await conn.sendMessage(from, {
            react: { text: "😞", key: mek.key }
        });

        reply(`An error occurred while processing your request: ${e.message}`);
    }
});
