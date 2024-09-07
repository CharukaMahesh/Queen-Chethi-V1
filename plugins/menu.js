const { cmd } = require('../command');

//_____________

//📜--------MENU-------📜//

cmd({
    pattern: "menu",
    desc: "Displays available commands",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply
}) => {
    try {
        // React with 📜 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📜", key: mek.key }
        });

        // Construct the menu message
        let menuMessage = `
 𝗤𝗨𝗘𝗘𝗡 𝗖𝗛𝗘𝗧𝗛𝗜 𝗕𝗢𝗧 𝗠𝗘𝗡𝗨 🛡️

*🔸 .song [song name or URL]* - Download music from YouTube
*🔸 .weather [city name]* - Get weather information
*🔸 .quote* - Get a random quote
*🔸 .news* - Get the latest news
*🔸 .joke* - Get a random joke

*🛠️ 𝗧𝗢𝗢𝗟𝗦*:
*🔸 .sticker* - Convert image to sticker
*🔸 .gifsticker* - Convert GIF to sticker

*ℹ️ 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡*:
*🔸 .about* - Learn about this bot
*🔸 .help* - Get help on using this bot

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        // Send the menu message
        await conn.sendMessage(from, {
            text: menuMessage
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
