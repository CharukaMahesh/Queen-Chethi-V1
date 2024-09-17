const { cmd } = require('../command');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

cmd({
    pattern: "qrcode",
    desc: "Generate a QR code from text",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, q, reply }) => {
    try {
        if (!q) {
            return reply("Please provide the text to generate a QR code.");
        }

        // React with 📈 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📈", key: mek.key }
        });

        // Generate QR code
        const qrCodePath = path.join(__dirname, 'qrcode.png');
        await QRCode.toFile(qrCodePath, q);

        // Send the QR code
        await conn.sendMessage(from, {
            image: fs.readFileSync(qrCodePath),
            caption: `Here is your QR code for: ${q}`
        }, { quoted: mek });

        // Clean up the temporary file
        fs.unlinkSync(qrCodePath);

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
