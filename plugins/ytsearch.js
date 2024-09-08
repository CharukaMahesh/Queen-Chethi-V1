const ytSearch = require('yt-search');
const { cmd } = require('../command');

cmd({
    pattern: "ytsearch",
    desc: "Search for YouTube videos",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        // Join the arguments to form the search query
        const query = args.join(' ').trim();

        if (!query) return reply('Please provide a search query.');

        // React with 🔍 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🔍", key: mek.key }
        });

        // Perform the YouTube search
        const results = await ytSearch(query);

        if (results && results.videos.length > 0) {
            const topVideo = results.videos[0]; // Get the top result

            let responseMessage = `
*👸𝗤𝗨𝗘𝗘𝗡 𝗖𝗛𝗘𝗧𝗛𝗜 𝗬𝗧 𝗦𝗘𝗔𝗥𝗖𝗛👸*

            
🎬 *Title:* ${topVideo.title}
🕒 *Duration:* ${topVideo.timestamp}
👁️ *Views:* ${topVideo.views}
📅 *Uploaded:* ${topVideo.ago}
🔗 *Link:* ${topVideo.url}

*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝙲𝙷𝙴𝚃𝙷𝙸 𝙼𝙳*
            `;

            // Send the top video details with the thumbnail
            await conn.sendMessage(from, {
                text: responseMessage,
                previewType: 'IMAGE',
                mediaUrl: topVideo.thumbnail
            }, { quoted: mek });
        } else {
            reply('No videos found for your query.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while searching for the video. Please try again later.");
    }
});
