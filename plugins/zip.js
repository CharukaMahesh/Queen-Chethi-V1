const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const { cmd } = require('../command');

cmd({
    pattern: "zip",
    desc: "Zip the bot files",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // React with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        const zipFileName = 'bot_script.zip';
        const output = fs.createWriteStream(path.join(__dirname, zipFileName));
        const archive = archiver('zip', {
            zlib: { level: 9 } // Highest compression level
        });

        // Event listener to handle close after zipping is completed
        output.on('close', function () {
            console.log(`Zipping completed: ${archive.pointer()} total bytes`);
            conn.sendMessage(from, {
                document: { url: path.join(__dirname, zipFileName) },
                fileName: zipFileName,
                mimetype: 'application/zip'
            }, { quoted: mek });

            // React with 📡 when the zip file is sent
            conn.sendMessage(from, {
                react: { text: "📡", key: mek.key }
            });
        });

        // Handle errors in the archiving process
        archive.on('error', (err) => {
            throw err;
        });

        // Pipe the archive to the output stream
        archive.pipe(output);

        // Add the entire bot directory to the zip file
        archive.directory(__dirname, false);

        // Finalize the archive
        await archive.finalize();

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred while zipping the files: ${e.message}`);
    }
});
