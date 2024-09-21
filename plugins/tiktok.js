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

        // React with 🎥 when the command is triggered
        await conn.sendMessage(from, { react: { text: "🎥", key: mek.key } });

        // Try downloading the video
        const data = await alldown(q);
        if (!data || !data.dl_url) {
            return reply("Failed to download the TikTok video. Please ensure the URL is correct and supported.");
        }

        const downloadUrl = data.dl_url;

        // React with 📥 when download starts
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

        // Send the video
        await conn.sendMessage(from, {
            video: { url: downloadUrl },
            mimetype: 'video/mp4',
            caption: `${data.title || 'TikTok Video'}`
        }, { quoted: mek });

        // React with ✅ when the upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while downloading the TikTok video. Please try again later.");
        await conn.sendMessage(from, { react: { text: "😞", key: mek.key } });
    }
});
