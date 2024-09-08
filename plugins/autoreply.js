const { cmd } = require('../command');

cmd({
    on: 'text', // Listen for text messages
    desc: "Auto-reply to 'Gn', 'Good Night', and Sinhala equivalents",
    category: "auto-reply",
    filename: __filename
},
async (conn, mek, m, {
    from, text, reply
}) => {
    try {
        // Convert message to lowercase for case-insensitive matching
        const message = text.toLowerCase();

        // Define phrases to match
        const phrases = [
            "gn",
            "good night",
            "ගුඩ් නයිට්",
            "හෙලෝ",
            "සුභ රැයක්",
            "සුභ රාත්‍රියක්"
        ];

        // Check if the message contains any of the phrases
        const shouldReply = phrases.some(phrase => message.includes(phrase));

        if (shouldReply) {
            // React with a 🌙 emoji
            await conn.sendMessage(from, {
                react: { text: "🌙", key: mek.key }
            });

            // Auto-reply with a good night message in Sinhala
            await conn.sendMessage(from, {
                text: "සුභ රාත්‍රියක්! නිදාගන්නා ලෙස සීතා සුභ සිහි පතාමි! 😴🌙"
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request.");
    }
});
