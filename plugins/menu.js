const { cmd } = require('../command');

//_____________

//📜--------MENU-------📜//

cmd({
    pattern: "menu",
    desc: "Displays available commands",
    category: "information",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        // React with 📜 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📜", key: mek.key }
        });

        // Construct the menu message
        let menuMessage = `
 --- 👸𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐄𝐓𝐇𝐈 𝐌𝐃👸 ---

👋𝐇𝐄𝐋𝐋𝐎 ${pushname}
_____________________________________

    *°|----🌏 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

   🧭 .song[song name     or URL] - Download Music From Youtube..

   🧭 .video[video name or URL] - Download Video From Youtube..

   🧭 .ytmp3[song name or URL] - Download Music From Youtube..

   🧭 .ytmp4[video name or URL] - Download Video From Youtube..

_____________________________________
         *°|----🌏 𝙰𝙸-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

 🧭.ai - Ask Any Question From Chatgpt..

_____________________________________
         *°|----🌏 𝚂𝙴𝙰𝚁𝙲𝙷-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

🧭.weather[Country Or City] - To Know Current Weather Situation Of Any Country

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
