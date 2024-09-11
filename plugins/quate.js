const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "quote",
    desc: "Get a random motivational quote",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // React with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📜", key: mek.key }
        });

        // Make an API request to get a random quote
        const response = await axios.get('https://zenquotes.io/api/random');

        // Extract the quote and author from the response
        const quote = response.data[0].q;
        const author = response.data[0].a;

        // Send the quote back to the user
        const quoteMessage = `💬 *Quote of the Day:*\n\n"${quote}"\n\n- _${author}_`;

        await conn.sendMessage(from, { text: quoteMessage }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while fetching the quote. Please try again later.");
    }
});
