const pinterest = require('pinterest-downloader');
const { cmd } = require('../command');

cmd({
    pattern: "pin",
    desc: "Download Pinterest images or videos",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        // Get the Pinterest URL from the command arguments
        const url = args[0];
        
        if (!url) return reply('Please provide a Pinterest URL.');

        // React with 📥 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📥", key: mek.key }
        });

        // Download media from Pinterest
        const media = await pinterest.getMedia(url);

        if (media) {
            // Send the downloaded media to the user
            await conn.sendMessage(from, {
                video: { url: media[0] }, // This works for both images and videos
                caption: 'Here is your downloaded media from Pinterest'
            }, { quoted: mek });
        } else {
            reply('No media found at the provided URL.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
