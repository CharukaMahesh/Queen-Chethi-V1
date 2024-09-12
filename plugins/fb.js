const fbDownloader = require('facebook-video-downloader');
const { cmd } = require('../command');

cmd({
    pattern: "fbdown",
    desc: "Download a Facebook video using its URL",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // React with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        if (args.length === 0) {
            reply("Please provide the Facebook video URL. Example: `.fbdown [video_url]`");
            return;
        }

        const videoUrl = args[0];

        // Download the Facebook video
        const videoData = await fbDownloader.getVideo(videoUrl);

        if (videoData && videoData.downloadURL) {
            // Send the video to the chat
            await conn.sendMessage(from, {
                video: { url: videoData.downloadURL },
                caption: `📥 *Downloaded from Facebook*\n\nTitle: ${videoData.title}`
            }, { quoted: mek });

            // React with 📡 after successfully sending the video
            await conn.sendMessage(from, {
                react: { text: "📡", key: mek.key }
            });

        } else {
            reply("Sorry, unable to download the video. Please check the URL.");
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while downloading the Facebook video. Please try again later.");
    }
});
