const { cmd } = require('../command');
const { alldown } = require('nayan-media-downloader');

cmd({
    pattern: 'download',
    desc: 'Download media from various platforms (Facebook, TikTok, Twitter, Instagram, etc.)',
    category: 'media',
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply('Please provide a valid URL. Example: .download https://example.com');

        // React with 🔍 when searching/downloading
        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });

        // Start downloading media from the provided URL
        const url = q;
        console.log(`Processing download for URL: ${url}`);  // Log the URL being processed

        const mediaData = await alldown(url).catch((error) => {
            console.error(`Error downloading media from ${url}:`, error.message);
            reply(`Error: ${error.message}`);
            return null;
        });

        // Log the entire response from alldown to check its structure
        console.log("Response from alldown:", mediaData);

        if (!mediaData || !mediaData.url) {
            return reply('Failed to download media. Please ensure the URL is correct and supported.');
        }

        if (mediaData.type === 'video') {
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });
            await conn.sendMessage(from, {
                video: { url: mediaData.url },
                caption: `Downloaded media from: ${url}`,
            }, { quoted: mek });
        } else if (mediaData.type === 'image') {
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });
            await conn.sendMessage(from, {
                image: { url: mediaData.url },
                caption: `Downloaded media from: ${url}`,
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });
            await conn.sendMessage(from, {
                document: { url: mediaData.url },
                mimetype: mediaData.mime,
                fileName: mediaData.name || 'downloaded_media',
                caption: `Downloaded media from: ${url}`,
            }, { quoted: mek });
        }

        // React with ✅ when download is complete
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('Error:', error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});
