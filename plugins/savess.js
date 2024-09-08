const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "save",
    desc: "Save a status image or video",
    category: "media",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply
}) => {
    try {
        // Auto-react with a specific emoji when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        // Check if the message is a status update with media
        if (m.message && (m.message.imageMessage || m.message.videoMessage)) {
            const media = m.message.imageMessage || m.message.videoMessage;
            const mediaUrl = media.url;
            const fileName = mediaUrl.split('/').pop();
            const filePath = path.join(__dirname, fileName);

            // Download the media file
            const response = await axios({
                url: mediaUrl,
                method: 'GET',
                responseType: 'stream'
            });
            
            response.data.pipe(fs.createWriteStream(filePath));
            
            response.data.on('end', () => {
                console.log(`File downloaded: ${fileName}`);
                
                // Send confirmation message
                conn.sendMessage(from, {
                    text: `Status saved successfully. File: ${fileName}`
                }, { quoted: mek });
            });
            
            response.data.on('error', (err) => {
                console.error("Error downloading file:", err);
                reply("An error occurred while saving the status. Please try again.");
            });
        } else {
            reply("Please reply to a status image or video to save it.");
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
