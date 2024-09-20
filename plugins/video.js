const { cmd } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');

// 🎧--------VIDEO-DOWNLOAD-------//

cmd({
    pattern: "video",
    desc: "Download videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid URL or video name... 🙋‍♂️");

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply("*`I AM SEARCHING FOR YOUR VIDEO...🎥`*");

        // Search video
        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🎥 𝗤𝗨𝗘𝗘𝗡 𝗖𝗛𝗘𝗧𝗛𝗜 𝗬𝗧 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🎥

*TITLE* 🔍: ${data.title}
*DESCRIPTION* 🗒️: ${data.description}
*TIME* ⏰: ${data.timestamp}
*AGO* 🚀: ${data.ago}
*VIEWS* 📽️: ${data.views}

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`I AM Downloading Your Video...📥`*");

        // Download Video
        let downVideo = await fg.ytv(url);
        if (!downVideo || !downVideo.dl_url) {
            return reply("Failed to download video. Please try again later.");
        }
        let downloadVideoUrl = downVideo.dl_url;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`I AM Uploading Your Video...📤`*");

        // Send Video File
        await conn.sendMessage(from, {
            video: { url: downloadVideoUrl },
            mimetype: "video/mp4",
            caption: `${data.title} - Video`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Video uploaded successfull... ✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});

// 🎧--------YTMP4-DOWNLOAD-------//

cmd({
    pattern: "ytmp4",
    desc: "Download videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a valid URL or video name... 🙋‍♂️");

        // React with 🔍 and show searching text
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        reply("*`I AM Searching Your Video...🎥`*");

        // Search video
        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) {
            return reply("No results found for the given query.");
        }

        const data = search.videos[0];
        const url = data.url;

        let desc = `
🎥 𝗤𝗨𝗘𝗘𝗡 𝗖𝗛𝗘𝗧𝗛𝗜 𝗬𝗧 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🎥

*TITLE* 🔍: ${data.title}
*DESCRIPTION* 🗒️: ${data.description}
*TIME* ⏰: ${data.timestamp}
*AGO* 🚀: ${data.ago}
*VIEWS* 📽️: ${data.views}

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // React with 📥 and show downloading text
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });
        reply("*`I AM Downloading Your video...📥`*");

        // Download Video
        let downVideo = await fg.ytv(url);
        if (!downVideo || !downVideo.dl_url) {
            return reply("Failed to download video. Please try again later.");
        }
        let downloadVideoUrl = downVideo.dl_url;

        // React with 📤 and show uploading text
        await conn.sendMessage(from, { react: { text: "📤", key: mek.key } });
        reply("*`I AM Uploading Your Video...📤`*");

        // Send Video File
        await conn.sendMessage(from, {
            video: { url: downloadVideoUrl },
            mimetype: "video/mp4",
            caption: `${data.title} - Video`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply("*`Video uploaded successfully...✅`*");

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
