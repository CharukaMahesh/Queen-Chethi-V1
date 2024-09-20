const { cmd } = require('../command');
const yts = require('yt-search'); // Ensure yt-search is installed
const fg = require('fetch-yt'); // Assuming you're using fetch-yt for downloading

cmd({ pattern: 'song', desc: 'Download song from YouTube', category: 'Music' }, async (conn, from, q, mek, reply) => {
    try {
        // Search YouTube for the query
        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🎶 𝗤𝗨𝗘𝗘𝗡 𝗖𝗛𝗘𝗧𝗛𝗜 𝗠𝗨𝗦𝗜𝗖 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🎶

*TITLE* 🔍: ${data.title}
*DESCRIPTION* 🗒️: ${data.description}
*DURATION* ⏰: ${data.timestamp}
*AGO* 🚀: ${data.ago}
*VIEWS* 📽️: ${data.views}

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        // Send song details with thumbnail
        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`I AM Downloading Your song...📥`*");

        // Download Song
        let downAudio = await fg.yta(url); // Use yta for audio download
        if (!downAudio || !downAudio.dl_url) {
            return reply("Failed to download the song. Please try again later.");
        }
        let downloadAudioUrl = downAudio.dl_url;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`I AM Uploading Your Song...📤`*");

        // Send Audio File
        await conn.sendMessage(from, {
            audio: { url: downloadAudioUrl },
            mimetype: "audio/mp4",
            ptt: false, // Set to true if you want it as a voice note
            caption: `${data.title} - Audio`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Song uploaded successfully...✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
