const { cmd } = require('../command');
const { alldown } = require('nayan-media-downloader');

cmd({
    pattern: 'download',
    desc: 'Download media from Facebook, TikTok, Instagram, YouTube, etc.',
    category: 'media',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply('Please provide a valid URL. Example: .download https://example.com');

        // React with 🔍 to indicate that the bot is processing the request
        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });

        const url = q;
        console.log(`Downloading media from URL: ${url}`);

        // Start downloading media
        const mediaData = await alldown(url).catch(error => {
            console.error(`Error while downloading media from ${url}:`, error.message);
            reply(`Error: ${error.message}`);
            return null;
        });

        // Log the full response for debugging purposes
        console.log("alldown Response:", mediaData);

        // Handle case where no media data is returned
        if (!mediaData || !mediaData.url) {
            return reply('Failed to download media. Please ensure the URL is correct and supported.');
        }

        // Send different types of media based on the type
        if (mediaData.type === 'video') {
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });
            await conn.sendMessage(from, {
                video: { url: mediaData.url },
                caption: `Downloaded video from: ${url}`,
            }, { quoted: mek });
        } else if (mediaData.type === 'image') {
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });
            await conn.sendMessage(from, {
                image: { url: mediaData.url },
                caption: `Downloaded image from: ${url}`,
            }, { quoted: mek });
        } else if (mediaData.mime) {
            // For other media types like documents
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });
            await conn.sendMessage(from, {
                document: { url: mediaData.url },
                mimetype: mediaData.mime,
                fileName: mediaData.name || 'media_file',
                caption: `Downloaded media from: ${url}`,
            }, { quoted: mek });
        } else {
            // Fallback if none of the types matched
            return reply('Failed to recognize media type.');
        }

        // React with ✅ after successful download
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('Error:', error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});
