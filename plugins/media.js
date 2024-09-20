const { cmd } = require('../command');
const { alldown } = require('nayan-media-downloader'); // Importing the downloader module

// Command to trigger media download
cmd({
    pattern: 'download',
    desc: 'Download media from various platforms (Facebook, TikTok, Twitter, Instagram, YouTube, etc.)',
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
        const mediaData = await alldown(url);
        
        if (!mediaData || !mediaData.url) {
            return reply('Failed to download media. Please ensure the URL is correct and supported.');
        }

        // If media is video
        if (mediaData.type === 'video') {
            // React with 📥 when downloading starts
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

            // Send the video
            await conn.sendMessage(from, {
                video: { url: mediaData.url },
                caption: `Downloaded media from: ${url}`,
            }, { quoted: mek });

        // If media is image
        } else if (mediaData.type === 'image') {
            // React with 📥 when downloading starts
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

            // Send the image
            await conn.sendMessage(from, {
                image: { url: mediaData.url },
                caption: `Downloaded media from: ${url}`,
            }, { quoted: mek });

        // Other media types (audio, etc.)
        } else {
            // React with 📥 when downloading starts
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

            // Send the file
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
