const axios = require('axios');
const { cmd } = require('../command');
const moment = require('moment');

//_____________

//📜--------MENU-------📜//

cmd({
    pattern: "menu",
    desc: "Displays available commands",
    category: "information",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, prefix }) => {
    try {
        // React with 📜 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📝", key: mek.key }
        });

        // Get current time and date
        const currentTime = moment().format('hh:mm A');
        const currentDate = moment().format('DD MMMM YYYY');

        // Calculate bot uptime
        const uptime = process.uptime();
        const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor(uptime % 3600 / 60)}m ${Math.floor(uptime % 60)}s`;

        // Fetch a random quote
        const quoteRes = await axios.get('https://api.quotable.io/random');
        const quote = quoteRes.data.content;
        const author = quoteRes.data.author;

        // Add an IP search feature
        let ipAddress = args[0];  // Assuming user passes IP as an argument
        let ipInfo = "No IP searched";
        if (ipAddress) {
            try {
                const ipRes = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
                ipInfo = `
                🌍 *IP Information* 🌍
                IP: ${ipRes.data.ip}
                City: ${ipRes.data.city}
                Region: ${ipRes.data.region}
                Country: ${ipRes.data.country_name}
                Postal Code: ${ipRes.data.postal}
                `;
            } catch (e) {
                ipInfo = "Invalid IP or failed to fetch IP details.";
            }
        }

        // Construct the menu message
        let menuMessage = `
--- 👸𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐄𝐓𝐇𝐈 𝐌𝐃👸 ---

👋𝐇𝐄𝐋𝐋𝐎 ${pushname} 🌟

📡𝐂𝐎𝐌𝐌𝐀𝐍𝐃: ${command}
📅 𝐃𝐀𝐓𝐄: ${currentDate}
⏰ 𝐓𝐈𝐌𝐄: ${currentTime}
📡𝐔𝐏𝐓𝐈𝐌𝐄: ${uptimeFormatted}
📋𝐏𝐑𝐄𝐅𝐈𝐗: ${prefix}

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

📡.weather[Country Or City] - To Know Current Weather Situation..

📡.ytsearch - Search Accross Youtube..

📡.wiki - Search Across Wikipedia..

_____________________________________
         *°|----🌏 𝙾𝚆𝙽𝙴𝚁-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.restart - For Restarting The Bot..

_____________________________________
         *°|----🌏 𝙶𝙴𝙽𝙴𝚁𝙰𝙻-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.ping - Check Bot Respond Speed..

📡.system - Check Bot Server Info..

_____________________________________
         *°|----🌏 𝙽𝙴𝚆𝚂-𝙼𝙴𝙽𝚄 🌏----|°*
_____________________________________

📡.hirunews - Get News From Hiru News..

_____________________________________
         *°|----🌏 𝙾𝚃𝙷𝙴𝚁🌏----|°*
_____________________________________

📡.tempmail - Get Temporary Email Address..

📡.about - Get Info About The Bot..

_____________________________________
       🌍 *IP Info (Optional)* 🌍
${ipInfo}
_____________________________________

💡 *Quote of the Day*: 
"${quote}" - ${author}

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ & ᴄʜᴇᴛʜᴀɴᴀ ʀᴀᴊᴀɢᴜʀᴜ*
        `;

        // Send the menu message with an image
        const imageUrl = 'https://raw.githubusercontent.com/CharukaMahesh/Queen-Chethi-V1/main/Img/20240906_190337.jpg'; // Image URL
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: menuMessage
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
