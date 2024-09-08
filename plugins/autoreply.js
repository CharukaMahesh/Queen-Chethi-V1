const { cmd } = require('../command');

// Listen for all incoming messages
cmd({
    on: 'text', // Listen for text messages
    desc: "Auto-reply to 'Gn' or 'Good Night'",
    category: "auto-reply",
    filename: __filename
},
async (conn, mek, m, {
    from, text, reply
}) => {
    try {
        // Convert message to lowercase for case-insensitive matching
        const message = text.toLowerCase();

        // Check if the message is "gn" or "good night"
        if (message === "gn" || message === "good night") {
            // React with a 🌙 emoji
            await conn.sendMessage(from, {
                react: { text: "🌙", key: mek.key }
            });

            // Auto-reply with a good night message
            await conn.sendMessage(from, {
                text: "Good night! Sleep well and sweet dreams! 😴🌙"
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request.");
    }
});
