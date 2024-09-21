const axios = require('axios');
const cheerio = require('cheerio');

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

        const response = await axios.post('https://tikdown.org/en', new URLSearchParams({ url: q }));
        const $ = cheerio.load(response.data);
        
        const videoUrl = $('#download a').attr('href'); // Adjust selector based on the page structure

        if (!videoUrl) return reply("Failed to retrieve video. Please try again later.");

        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: "Here's your TikTok video!"
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while downloading the TikTok video. Please try again later.");
    }
});
