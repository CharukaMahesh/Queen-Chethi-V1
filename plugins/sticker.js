const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const sharp = require('sharp');
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

        // Convert the image to a sticker using sharp
        const outputPath = path.join(__dirname, 'output.webp');
        await sharp(buffer)
            .resize(512, 512, { fit: 'contain' })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Send the sticker
        await conn.sendMessage(from, {
            sticker: fs.readFileSync(outputPath)
        }, { quoted: mek });

        // Clean up: delete the output file
        fs.unlinkSync(outputPath);

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
