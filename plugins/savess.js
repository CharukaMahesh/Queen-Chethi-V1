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
        // Debugging: Log the detected media types
        console.log("isQuotedImage:", isQuotedImage);
        console.log("isQuotedVideo:", isQuotedVideo);

        // Check if the message is a quoted status (image or video)
        if (!isQuotedImage && !isQuotedVideo) {
            return reply('Please reply to a status image or video to save it.');
        }

        // React with 💾 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "💾", key: mek.key }
        });

        // Download the media from the quoted message
        const mediaBuffer = await conn.downloadMediaMessage(quoted);

        // Debugging: Check if the media buffer is valid
        if (!mediaBuffer) {
            console.log("Failed to download the media.");
            return reply('Failed to download the status. Please try again.');
        }

        // Determine the media type and set file extension accordingly
        const fileExtension = isQuotedImage ? 'jpg' : 'mp4';
        const fileName = `status_${Date.now()}.${fileExtension}`;

        // Ensure the 'saved_statuses' directory exists
        const directoryPath = path.join(__dirname, 'saved_statuses');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        // Save the status media to the file system
        const filePath = path.join(directoryPath, fileName);
        fs.writeFileSync(filePath, mediaBuffer);

        // Send a confirmation message
        reply(`Status saved successfully! File: ${fileName}`);

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
