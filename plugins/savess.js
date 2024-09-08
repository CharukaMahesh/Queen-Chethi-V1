const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

cmd({
    pattern: "save",
    desc: "Save a status image or video",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, isQuotedImage, isQuotedVideo, quoted
}) => {
    try {
        // Check if the message is a quoted status
        if (!isQuotedImage && !isQuotedVideo) {
            return reply('Please reply to a status image or video to save it.');
        }

        // React with 💾 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "💾", key: mek.key }
        });

        // Determine whether the status is an image or video
        const mediaType = isQuotedImage ? 'image' : 'video';

        // Download the media from the quoted message
        const mediaBuffer = await conn.downloadMediaMessage(quoted);
        if (!mediaBuffer) {
            return reply('Failed to download the status. Please try again.');
        }

        // Define the file path to save the status media
        const fileName = `status_${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`;
        const filePath = path.join(__dirname, 'saved_statuses', fileName);

        // Ensure the 'saved_statuses' directory exists
        if (!fs.existsSync(path.join(__dirname, 'saved_statuses'))) {
            fs.mkdirSync(path.join(__dirname, 'saved_statuses'));
        }

        // Save the status media to the file system
        fs.writeFileSync(filePath, mediaBuffer);

        // Send a confirmation message
        reply(`Status saved successfully! File: ${fileName}`);

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
