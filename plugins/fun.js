const { cmd } = require('../command');

// 📜--------LIKE COMMAND-------📜//

cmd({
    pattern: "like",
    desc: "Send a like with a fun message",
    category: "fun",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, pushname, reply}) => {
    try {
        const likeMessages = [
            "👍 You got a like from Queen Chethi!",
            "❤️ That's a big heart for you!",
            "🎉 Boom! You just got a like!",
            "💫 One like from the stars, especially for you!",
            "👑 You're liked by Queen Chethi, feel the royal love!"
        ];

        // Random message picker
        const randomLikeMessage = likeMessages[Math.floor(Math.random() * likeMessages.length)];

        // Send the like message
        await conn.sendMessage(from, {
            text: randomLikeMessage
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
