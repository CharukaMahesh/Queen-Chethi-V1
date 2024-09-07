const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

cmd({
    pattern: "song",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, reply
}) => {
    try {
        if (!q) return reply("Please provide a valid URL or song name... 🙋‍♂️");

        // React with 🎧 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎧", key: mek.key }
        });

        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🧬𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐄𝐓𝐇𝐈 𝐘𝐓 𝗠𝗨𝗦𝗜𝗖 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑🧬

*TITLE* 🔍: ${data.title}

*DESCRIPTION* 🗒️: ${data.description}

*TIME* ⌛: ${data.timestamp}

*AGO* ☄️: ${data.ago}

*VIEWS* 📽️: ${data.views}

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });

        // Download Audio
        let downAudio = await fg.yta(url);
        if (!downAudio || !downAudio.dl_url) {
            return reply("Failed to download audio. Please try again later.");
        }
        let downloadAudioUrl = downAudio.dl_url;

        // Send Audio File
        await conn.sendMessage(from, {
            audio: { url: downloadAudioUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });
    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});



cmd({
    pattern: "video",
    desc: "Download songs",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, reply
}) => {
    try {
        if (!q) return reply("Please provide a valid URL or song name... 🙋‍♂️");

        // React with 🎧 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎧", key: mek.key }
        });

        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🧬𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐄𝐓𝐇𝐈 𝐘𝐓 𝗠𝗨𝗦𝗜𝗖 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑🧬

*TITLE* 🔍: ${data.title}

*DESCRIPTION* 🗒️: ${data.description}

*TIME* ⌛: ${data.timestamp}

*AGO* ☄️: ${data.ago}

*VIEWS* 📽️: ${data.views}

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: desc
        }, { quoted: mek });
// Download Video
        let downVideo = await fg.ytv(url);
        if (!downVideo || !downVideo.dl_url) {
            return reply("Failed to download video. Please try again later.");
        }
        let downloadVideoUrl = downVideo.dl_url;

        // React with 🎥 before sending the video
        await conn.sendMessage(from, {
            react: { text: "🎥", key: mek.key }
        });

        // Send Video File
        await conn.sendMessage(from, {
            video: { url: downloadVideoUrl },
            mimetype: "video/mp4",
            caption: `${data.title} - Video`
        }, { quoted: mek });
    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
