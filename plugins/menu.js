const { cmd } = require('../command');

//_____________

//📜--------MENU-------📜//

cmd({
    pattern: "menu",
    desc: "Displays available commands",
    category: "information",
    filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        // React with 📜 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📝", key: mek.key }
        });

        // Image URL
        const imageUrl = 'https://raw.githubusercontent.com/CharukaMahesh/Queen-Chethi-V1/main/Img/20240906_190337.jpg';

        // Construct the menu message
        let menuMessage = `
--- 👸𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐄𝐓𝐇𝐈 𝐌𝐃👸 ---

👋𝐇𝐄𝐋𝐋𝐎 ${pushname}
📡𝐂𝐎𝐌𝐌𝐀𝐍𝐃 ${command}
_____________________________________

    *°|----🌏 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.song[song name or URL] - Download Music From Youtube..

📡.video[video name or URL] - Download Video From Youtube..

📡.ytmp3[song name or URL] - Download Music From Youtube..

📡.ytmp4[video name or URL] - Download Video From Youtube..

_____________________________________
         *°|----🌏 𝙰𝙸-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.ai - Ask Any Question From Chatgpt..

📡.aiimg - Create Images Using Ai..

_____________________________________
         *°|----🌏 𝚂𝙴𝙰𝚁𝙲𝙷-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.weather[Country Or City] - To Know Current Weather Situation Of Any Country

📡.ytsearch - Search Accross Youtube..

📡.wiki - Search Accross Wikipedia..

_____________________________________
         *°|----🌏 𝙾𝚆𝙽𝙴𝚁-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.restart - For Restart The Bot..

_____________________________________
         *°|----🌏 𝙶𝙴𝙽𝙴𝙰𝙻-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.ping - Check Bot Respond Speed..

📡.system - Check Bot Server Info

_____________________________________
         *°|----🌏 𝙽𝙴𝚆𝚂-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.hirunews - Get News From Hiru News

_____________________________________
         *°|----🌏 𝙾𝚃𝙷𝙴𝚁🌏----|°*
_____________________________________

📡.tempmail - Get Temporary Email Address..

📡.about - Get About Of The Bot..

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        // Send the menu message with the image from URL
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: menuMessage
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
