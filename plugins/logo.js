const { cmd } = require('../command');
const nayan = require('nayan-bing-api'); // Assuming this is the package
const fs = require('fs');

// Command to trigger AI Image generation
cmd({
    pattern: 'aiimg',
    desc: 'Generate AI images using Bing AI',
    category: 'ai',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('Please provide a prompt for the AI image generation. Example: .aiimg cute puppy');

        // React with 🔍 when searching
        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });

        // Fetch AI image based on the query
        const result = await nayan.generateAIImage(q); // Assuming this is the function
        if (!result || !result.url) {
            return reply('Failed to generate the AI image. Please try again.');
        }

        // Download the image
        const imageUrl = result.url;
        const imagePath = `./temp/${Date.now()}.jpg`;
        const writer = fs.createWriteStream(imagePath);

        const downloadStream = await fetch(imageUrl);
        downloadStream.body.pipe(writer);

        writer.on('finish', async () => {
            // React with 📥 when image is downloading
            await conn.sendMessage(from, { react: { text: '📥', key: mek.key } });

            // Send the AI-generated image
            await conn.sendMessage(from, {
                image: { url: imagePath },
                caption: `Here is your AI-generated image for: *${q}*`,
            }, { quoted: mek });

            // React with ✅ after successful send
            await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

            // Clean up the downloaded image file
            fs.unlinkSync(imagePath);
        });
    } catch (error) {
        console.error('Error:', error);
        reply('An error occurred while processing your request. Please try again later.');
    }
});
