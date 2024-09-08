const wikipedia = require('wikipedia');
const { cmd } = require('../command');

cmd({
    pattern: "wiki",
    desc: "Search Wikipedia and get a summary",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, args
}) => {
    try {
        // Ensure a search query is provided
        if (!args.join(' ')) {
            return reply('Please provide a search query.');
        }

        // React with 🔍 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🔍", key: mek.key }
        });

        // Construct the search query
        const query = args.join(' ');

        // Fetch the page summary directly
        const page = await wikipedia.page(query);
        const summary = await page.summary();

        // Check if the summary exists and send the summary text
        if (summary && summary.extract) {
            await conn.sendMessage(from, {
                text: summary.extract
            }, { quoted: mek });
        } else {
            reply('No summary available for this query.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
