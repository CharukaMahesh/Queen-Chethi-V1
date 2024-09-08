const songlyrics = require('songlyrics');
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
            return reply('Please provide the song name or artist.');
        }

        // React with 🎶 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎶", key: mek.key }
        });

        // Construct the search query
        const query = args.join(' ');

        // Search for lyrics
        const lyricsData = await songlyrics(query);

        // Check if lyrics were found
        if (lyricsData && lyricsData.lyrics) {
            const message = `
🎵 *${lyricsData.title}* by *${lyricsData.artist}*

${lyricsData.lyrics}

_Source: ${lyricsData.source}_
            `;

            // Send the lyrics
            await conn.sendMessage(from, { text: message }, { quoted: mek });
        } else {
            reply('Lyrics not found. Please try with a different query.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
