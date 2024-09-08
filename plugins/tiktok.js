const { cmd } = require('../command');
const TikTokScraper = require('tiktok-scraper');

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
        console.log("Video URL:", videoUrl);

        // Fetch TikTok video details
        const videoData = await TikTokScraper.getVideoMeta(videoUrl, { noWaterMark: true });
        console.log("Video Data:", videoData);

        // Check if video data is valid
        if (!videoData || !videoData.collector || !videoData.collector[0].videoUrl) {
            return reply("Sorry, I couldn't retrieve the video. Please try again with a valid TikTok URL.");
        }

        // Send the video to the user
        await conn.sendMessage(from, {
            video: { url: videoData.collector[0].videoUrl },
            caption: `🎥 *Video Title*: ${videoData.collector[0].text}\n📱 *From*: TikTok`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
