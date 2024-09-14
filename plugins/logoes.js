const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Command for bot
const { cmd } = require('../command');

cmd({
    pattern: "rain",
    desc: "Create a rain effect logo with custom text",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { args, from, reply }) => {
    try {
        // Auto-react with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        if (args.length === 0) {
            reply("Please provide text for the logo. Example: `.rainlogo [text]`");
            return;
        }

        const logoText = args.join(' '); // Join all text passed as arguments

        // Define canvas dimensions
        const width = 800;
        const height = 400;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background color
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        // Set text properties
        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw text
        ctx.fillText(logoText, width / 2, height / 2);

        // Add rain effect (basic effect)
        for (let i = 0; i < 300; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const length = Math.random() * 20;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + length);
            ctx.stroke();
        }

        // Save the image to file
        const out = fs.createWriteStream(path.join(__dirname, 'rainlogo.png'));
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', async () => {
            // Once image is saved, send the logo image in chat
            await conn.sendMessage(from, {
                image: { url: path.join(__dirname, 'rainlogo.png') },
                caption: "Here is your rain logo!"
            }, { quoted: mek });

            // React with 📡 after successfully sending the image
            await conn.sendMessage(from, {
                react: { text: "📡", key: mek.key }
            });
        });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
