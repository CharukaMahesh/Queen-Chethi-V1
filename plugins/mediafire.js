const { cmd } = require('../command');
const { mfiredl } = require('mfiredlcore-vihangayt');

// MediaFire download handler
cmd({
    pattern: "mediafire",
    desc: "Download files from MediaFire",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply('Please provide a valid MediaFire URL. Example: .mediafire https://mediafire.com/example');

        const mediafireUrl = q.trim();
        console.log(`Attempting to download from MediaFire URL: ${mediafireUrl}`);

        // React with 🔍 to indicate that the bot is processing the request
        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });

        // Download the file from MediaFire
        const mediafireData = await mfiredl(mediafireUrl);
        if (!mediafireData || !mediafireData.file) {
            return reply('Failed to fetch file details from the MediaFire URL. Ensure the URL is correct.');
        }

        const { file, directLink, size } = mediafireData;

        if (!directLink) {
            return reply('Failed to fetch the direct download link. MediaFire may be blocking this request.');
        }

        // Send a message with file info
        const fileInfo = `
📁 *File Name*: ${file}
📦 *Size*: ${size}
🔗 *Direct Link*: ${directLink}
        
File is being downloaded...
        `;
        await conn.sendMessage(from, { text: fileInfo }, { quoted: mek });

        // React with 📥 when download starts
        await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

        // Send the file to the chat
        await conn.sendMessage(from, {
            document: { url: directLink },
            mimetype: 'application/octet-stream',
            fileName: file,
            caption: `Downloaded from MediaFire: ${file}`
        }, { quoted: mek });

        // React with ✅ after successful download
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('Error downloading from MediaFire:', error);

        // Provide more descriptive error feedback to the user
        if (error.message.includes('404')) {
            return reply('The file could not be found. Please check the MediaFire URL.');
        } else if (error.message.includes('invalid URL')) {
            return reply('Invalid MediaFire URL. Please provide a proper MediaFire link.');
        } else {
            return reply('An error occurred while downloading the file. Please try again later.');
        }
    }
});
