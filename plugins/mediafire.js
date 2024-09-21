const { cmd } = require('../command');
const axios = require('axios');
const cheerio = require('cheerio');

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

        // Fetch the MediaFire page
        const response = await axios.get(mediafireUrl);
        if (!response || response.status !== 200) {
            return reply('Failed to fetch the MediaFire page. Please check the URL and try again.');
        }

        // Use cheerio to parse the HTML and extract the download link
        const $ = cheerio.load(response.data);
        const downloadLink = $('a#downloadButton').attr('href');

        if (!downloadLink) {
            return reply('Failed to find the download link on the MediaFire page. The file may not be available.');
        }

        // React with 📥 when download starts
        await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

        // Fetch file metadata (file name and size)
        const fileName = $('div.filename').text().trim();
        const fileSize = $('div.fileinfo').text().trim();

        // Notify the user about the file being downloaded
        let fileInfo = `
📁 *File Name*: ${fileName}
📦 *Size*: ${fileSize}
🔗 *Direct Link*: ${downloadLink}

File is being downloaded...
        `;
        await conn.sendMessage(from, { text: fileInfo }, { quoted: mek });

        // React with 📤 when file is being uploaded
        await conn.sendMessage(from, { react: { text: '📤', key: mek.key } });

        // Send the file as a document
        await conn.sendMessage(from, {
            document: { url: downloadLink },
            mimetype: 'application/octet-stream',
            fileName: fileName,
            caption: `Downloaded from MediaFire: ${fileName}`
        }, { quoted: mek });

        // React with ✅ when upload is complete
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('Error downloading from MediaFire:', error);

        return reply('An error occurred while downloading the file. Please try again later.');
    }
});
