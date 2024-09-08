const SongLyrics = require('songlyrics');
const { cmd } = require('../command');
const axios = require('axios');

// Initialize the SongLyrics client
const songLyrics = new SongLyrics();

cmd({
    pattern: "songly",
    desc: "Fetch lyrics for a given song",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        // Join the arguments to form the song title
        const songTitle = args.join(' ').trim();

        if (!songTitle) return reply('Please provide a song title.');

        // React with 🎵 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎵", key: mek.key }
        });

        // Fetch the song lyrics
        songLyrics.getLyrics(songTitle, async (err, lyrics) => {
            if (err) {
                console.error("Error:", err);
                return reply("An error occurred while fetching the lyrics. Please try again later.");
            }

            if (lyrics) {
                // Send the lyrics to the user
                let responseMessage = `
🎵 *Song Title:* ${songTitle}
📝 *Lyrics:*
${lyrics}
                `;

                await conn.sendMessage(from, {
                    text: responseMessage
                }, { quoted: mek });
            } else {
                reply('No lyrics found for the song you provided.');
            }
        });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
