const fetch = require('node-fetch');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Replace with your Remove.bg API key
const REMOVE_BG_API_KEY = 'YkwhudDMCqwaBXEnyn4PiLLw';

cmd({
    pattern: "removebg",
    desc: "Remove background from an image",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, args, isMedia, isQuotedImage, quoted
}) => {
    try {
        // Check if an image is attached or quoted
        if (!isMedia && !isQuotedImage) return reply('Please provide an image to remove the background.');

        // React with ✂️ when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "✂️", key: mek.key }
        });

        // Get the image from the message
        const imageMessage = isQuotedImage ? quoted : m;
        const buffer = await conn.downloadMediaMessage(imageMessage);

        // Define the file path to temporarily store the image
        const filePath = path.join(__dirname, 'temp_image.png');
        fs.writeFileSync(filePath, buffer);

        // Make a request to the Remove.bg API to remove the background
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': REMOVE_BG_API_KEY
            },
            body: buffer,
            encoding: null
        });

        if (!response.ok) throw new Error('Failed to remove background');

        const resultBuffer = await response.buffer();

        // Define the file path to save the background-removed image
        const outputFilePath = path.join(__dirname, 'output_image.png');
        fs.writeFileSync(outputFilePath, resultBuffer);

        // Send the background-removed image
        await conn.sendMessage(from, {
            image: { url: outputFilePath },
            caption: 'Here is your image with the background removed!'
        }, { quoted: mek });

        // Clean up: delete the temporary images
        fs.unlinkSync(filePath);
        fs.unlinkSync(outputFilePath);

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
