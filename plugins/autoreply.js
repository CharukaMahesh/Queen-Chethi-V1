const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('message', async (message) => {
    try {
        // Convert message body to lowercase for case-insensitive matching
        const msgBody = message.body.toLowerCase();

        // Check if message contains "good night" or similar phrases
        if (msgBody.includes('gn') || msgBody.includes('good night')) {
            // React with 🌙
            await message.react('🌙');

            // Send a reply
            await message.reply("Good night! Sleep well and sweet dreams! 🥱");
        }
    } catch (e) {
        console.error("Error:", e);
    }
});

client.initialize();
