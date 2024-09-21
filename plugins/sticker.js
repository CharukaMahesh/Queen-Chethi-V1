const { cmd } = require('../command');
const { createSticker } = require('sticker-maker-wa');

cmd({
    pattern: "sticker",
    desc: "Convert an image to a sticker",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted || !quoted.image) return reply("Please send an image to convert to a sticker.");

        // React with 📸 when the command is triggered
        await conn.sendMessage(from, { react: { text: "📸", key: mek.key } });

        // Get the image buffer from the quoted message
        const media = await conn.downloadMediaMessage(quoted);
        
        // Create sticker
        const stickerBuffer = await createSticker(media, { pack: 'Your Pack Name', author: 'Your Name' });

        // Send the sticker
        await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

        // React with ✅ after sending
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while creating the sticker. Please try again later.");
    }
});
