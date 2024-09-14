const axios = require('axios');
const { cmd } = require('../command');

// Command to fetch IP details
cmd({
    pattern: "ip",
    desc: "Get details of a given IP address",
    category: "utilities",
    filename: __filename
}, 
async (conn, mek, m, { args, reply, from }) => {
    if (args.length === 0) {
        return reply("Please provide an IP address. Example: `.ipinfo 8.8.8.8`");
    }
    
    const ip = args[0];

    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        const data = response.data;

        const ipDetails = `
🌐 *IP Information* 🌐

🔸 *IP Address*: ${data.ip}
🔸 *City*: ${data.city}
🔸 *Region*: ${data.region}
🔸 *Country*: ${data.country}
🔸 *Location*: ${data.loc}
🔸 *Organization*: ${data.org}
🔸 *Postal*: ${data.postal}
🔸 *Timezone*: ${data.timezone}
        `;

        await conn.sendMessage(from, {
            text: ipDetails
        }, { quoted: mek });

    } catch (e) {
        console.error("Error fetching IP details:", e);
        reply("An error occurred while fetching IP details. Please try again later.");
    }
});
