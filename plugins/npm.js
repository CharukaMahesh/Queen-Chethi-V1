const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "npm",
    desc: "Search for an NPM package",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide a package name or search query.");
        }

        // React to command trigger
        await conn.sendMessage(m.from, {
            react: { text: "🔍", key: mek.key }
        });

        // Fetch from NPM registry
        const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${query}&size=1`);

        const packageData = response.data.objects[0].package;

        // Send package details to the user
        let message = `*NPM Package Search Result:*\n\n`;
        message += `*Name⏰:* ${packageData.name}\n`;
        message += `*Version🧬:* ${packageData.version}\n`;
        message += `*Description📝:* ${packageData.description}\n`;
        message += `*Link🪄:* ${packageData.links.npm}\n`;
        message += `*Maintainers📌:* ${packageData.maintainers.map(m => m.username).join(", ")}\n`;
        
        reply(message);
        
    } catch (error) {
        console.error("Error searching NPM package:", error);
        reply("An error occurred while searching for the NPM package. Please try again later.");
    }
});
