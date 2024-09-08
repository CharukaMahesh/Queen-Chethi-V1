const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
    pattern: "tiktok",
    desc: "Download TikTok videos using external API",
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
        console.log("Video URL:", videoUrl);

        // Replace the API URL with a TikTok video download API
        const apiUrl = `https://api.tiklydown.com/v1/tiktok?url=${encodeURIComponent(videoUrl)}`;

        const response = await fetch(apiUrl);
        const videoData = await response.json();

        if (videoData.status !== 'success' || !videoData.videoUrl) {
            return reply("Sorry, I couldn't retrieve the video. Please try again later.");
        }

        // Send the video to the user
        await conn.sendMessage(from, {
            video: { url: videoData.videoUrl },
            caption: `🎥 *Video Title*: ${videoData.title}\n📱 *From*: TikTok`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
