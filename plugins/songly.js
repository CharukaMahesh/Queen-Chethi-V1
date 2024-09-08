const lyricsFinder = require('lyrics-finder');
const { cmd } = require('../command');

cmd({
    pattern: "lyrics",
    desc: "Search and download song lyrics",
    category: "music",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, args
}) => {
    try {
        // Ensure a search query is provided
        if (!args.join(' ')) {
            return reply('Please provide the song name and optionally the artist.');
        }

        // React with 🎶 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎶", key: mek.key }
        });

        // Construct the search query
        const query = args.join(' ');

        // Search for lyrics
        let lyrics = await lyricsFinder("", query); // You can specify artist as the first parameter, if needed.

        if (!lyrics) {
            lyrics = "Sorry, lyrics not found.";
        }

        // Send the lyrics
        await conn.sendMessage(from, {
            text: lyrics
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
