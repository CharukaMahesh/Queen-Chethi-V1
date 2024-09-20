const { cmd } = require('../command');
const nmd = require('nayan-media-downloader');

// YouTube Song Download Command
cmd({
    pattern: "ytmp3",
    desc: "Download songs from YouTube",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid YouTube URL or song name.");

        // React with 🔍 while searching for the song
        await conn.sendMessage(from, {
            react: { text: "🔍", key: mek.key }
        });
        reply("Searching for song on YouTube...");

        // Download YouTube audio using nayan-media-downloader
        const result = await nmd.youtube(q, { audio: true });
        
        if (!result || !result.audio || !result.audio.url) {
            return reply("Failed to fetch the song. Please try again later.");
        }

        // React with 📥 while downloading the song
        await conn.sendMessage(from, {
            react: { text: "📥", key: mek.key }
        });
        reply("Downloading song...");

        // Send the audio file after downloading
        await conn.sendMessage(from, {
            audio: { url: result.audio.url },
            mimetype: 'audio/mpeg',
            ptt: false // If you want it as a voice note, set ptt: true
        }, { quoted: mek });

        // React with 📤 while uploading the song
        await conn.sendMessage(from, {
            react: { text: "📤", key: mek.key }
        });

        // React with ✅ after the successful download and upload
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
    } catch (e) {
        console.error("Error downloading the song:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
