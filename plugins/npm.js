const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "npm",
    desc: "Search for NPM packages",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure the user provides a search query
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide a package name to search for.");
        }

        // React to the command being triggered
        await conn.sendMessage(m.from, {
            react: { text: "🔍", key: mek.key }
        });

        // Fetch NPM search results
        const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`);

        const packages = response.data.objects;
        
        if (packages.length === 0) {
            return reply("No packages found.");
        }

        // Build the search results message
        let resultMessage = `🔍 NPM Search Results for: *${query}*\n\n`;
        packages.forEach(pkg => {
            const { name, description, version, links } = pkg.package;
            resultMessage += `📦 *${name}*\n📝 Description: ${description || "No description available"}\n🔢 Version: ${version}\n🔗 [NPM Link](${links.npm})\n\n`;
        });

        // Send the result message to the user
        await conn.sendMessage(m.from, {
            text: resultMessage
        }, { quoted: mek });

    } catch (error) {
        console.error("Error:", error);
        reply("An error occurred while searching for the NPM package. Please try again later.");
    }
});
