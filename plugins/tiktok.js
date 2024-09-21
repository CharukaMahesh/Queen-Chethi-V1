const { cmd } = require('../command');
const { alldown } = require('nayan-media-downloader');

// 🎵 TikTok Media Download Command
cmd({
    pattern: "tiktok",
    desc: "Download TikTok videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid TikTok URL... 🙋‍♂️");

        // React with 🎵 when the command is triggered
        await conn.sendMessage(from, { react: { text: "🎵", key: mek.key } });

        const url = q;

        // Attempt to download the media
        const mediaData = await alldown(url);
        console.log('Media Data:', mediaData); // Log the full API response

        // Check if the download link exists
        if (!mediaData || !mediaData.dl_link) {
            return reply("Failed to download the TikTok video. Please ensure the URL is correct and supported.");
        }

        // Send TikTok Video
        await conn.sendMessage(from, {
            video: { url: mediaData.dl_link },
            mimetype: "video/mp4",
            caption: "Here is your TikTok video!"
        }, { quoted: mek });

        // React with ✅ after the video is sent
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while downloading the TikTok video. Please try again later.");
    }
});
