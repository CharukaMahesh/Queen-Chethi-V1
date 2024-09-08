const Pinterest = require('pinterest-api');
const { cmd } = require('../command');

const pinterest = new Pinterest({
    accessToken: 'YOUR_ACCESS_TOKEN'  // Replace with your Pinterest API access token
});

cmd({
    pattern: "pinterest",
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

        // Extract the pin ID from the URL (assuming URL is in the format `https://www.pinterest.com/pin/{pin_id}/`)
        const pinId = url.split('/').filter(Boolean).pop();
        
        // Fetch media details from Pinterest
        const pinDetails = await pinterest.getPin(pinId);

        if (pinDetails && pinDetails.media) {
            const mediaUrl = pinDetails.media.url;

            // Send the media to the user
            await conn.sendMessage(from, {
                video: { url: mediaUrl }, // This works for both images and videos
                caption: 'Here is your downloaded media from Pinterest'
            }, { quoted: mek });
        } else {
            reply('No media found at the provided URL.');
        }

    } catch (e) {
        console.error("Error occurred:", e.message); // Log the error message
        reply(`An error occurred: ${e.message}`); // Reply with the error message
    }
});
