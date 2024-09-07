const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const { Sticker, createSticker, StickerTypes } = require('sticker-maker-wa');
const fs = require('fs');
const path = require('path');

//_____________

//🖼️--------IMAGE TO STICKER-------🖼️//

cmd({
    pattern: "sticker",
    desc: "Convert image to sticker",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply
}) => {
    try {
        // Check if a media message is quoted (image)
        if (!quoted || !quoted.message || !quoted.message.imageMessage) {
            return reply("Please reply to an image with the command to convert it into a sticker.");
        }

        // React with 🖼️ when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🖼️", key: mek.key }
        });

        // Download the image
        const media = await downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Create sticker
        const sticker = new Sticker(buffer, {
            pack: 'Pack Name',  // Sticker Pack Name
            author: 'Author Name',  // Sticker Author
            type: StickerTypes.FULL,  // Sticker type
            quality: 80  // Sticker quality
        });

        const stickerBuffer = await sticker.toBuffer();
        
        // Send the sticker
        await conn.sendMessage(from, {
            sticker: stickerBuffer
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
