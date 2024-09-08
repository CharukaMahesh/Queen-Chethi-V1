const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    desc: "Download TikTok videos",
    category: "media",
    filename: __filename
},
async (conn, mek, m, {
    from, args, reply
}) => {
    try {
        // React with 🎵 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎵", key: mek.key }
        });

        if (!args.length) {
            return reply("Please provide a TikTok video URL.");
        }

        const videoUrl = args[0];

        // Use an alternative API to get the TikTok video
        const apiEndpoint = `https://api.tiktokdownloader.com/v1?url=${encodeURIComponent(videoUrl)}`;
        
        const response = await axios.get(apiEndpoint).catch(err => {
            throw new Error("Failed to retrieve video data from the API.");
        });

        // Ensure the response is valid
        if (!response.data || !response.data.downloadUrl) {
            throw new Error("Invalid video data received from the API.");
        }

        // Send the video to the user
        await conn.sendMessage(from, {
            video: { url: response.data.downloadUrl },
            caption: `🎥 *Video Title*: ${response.data.title}\n📱 *From*: TikTok`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
