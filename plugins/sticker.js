const { cmd } = require('../command');
const Sticker = require('sticker-maker-wa');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "sticker",
    desc: "Convert an image to a sticker",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, isMedia, isQuotedImage, quoted
}) => {
    try {
        // Check if an image is attached or quoted
        if (!isMedia && !isQuotedImage) {
            return reply('Please provide an image to convert to a sticker.');
        }

        // React with 🖼️ when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🖼️", key: mek.key }
        });

        // Get the image from the message
        const imageMessage = isQuotedImage ? quoted : m;
        const buffer = await conn.downloadMediaMessage(imageMessage);

        // Define the file path to temporarily store the image
        const filePath = path.join(__dirname, 'temp_image.png');
        fs.writeFileSync(filePath, buffer);

        // Create the sticker
        const sticker = new Sticker(buffer, {
            packname: 'My Sticker Pack',
            author: 'My Bot',
            type: 'image',
            crop: true, // Crop the image to fit the sticker dimensions
            keepScale: true // Maintain the aspect ratio
        });

        // Convert image to sticker
        const stickerBuffer = await sticker.toBuffer();

        // Define the file path to save the sticker
        const stickerPath = path.join(__dirname, 'output_sticker.webp');
        fs.writeFileSync(stickerPath, stickerBuffer);

        // Send the sticker
        await conn.sendMessage(from, {
            sticker: { url: stickerPath }
        }, { quoted: mek });

        // Clean up: delete the temporary image and sticker
        fs.unlinkSync(filePath);
        fs.unlinkSync(stickerPath);

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
