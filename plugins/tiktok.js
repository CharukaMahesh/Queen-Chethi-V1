const { alldown } = require("nayan-media-downloader");
const { cmd } = require('../command');

// TikTok Download Command
cmd({
    pattern: "tiktok",
    desc: "Download TikTok videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid TikTok URL.");

        await conn.sendMessage(from, { react: { text: "🎥", key: mek.key } });

        // Download the video
        const data = await alldown(q);
        if (!data || !data.dl_url) {
            return reply("Failed to download the TikTok video. Please ensure the URL is correct and supported.");
        }

        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

        // Send the video
        await conn.sendMessage(from, {
            video: { url: data.dl_url },
            mimetype: 'video/mp4',
            caption: `TikTok Video`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while downloading the TikTok video. Please try again later.");
    }
});
