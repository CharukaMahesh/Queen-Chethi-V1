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

        // Search Wikipedia
        const result = await wikipedia.search(query);

        // Check if the search returned results
        if (result && result.query && result.query.search && result.query.search.length > 0) {
            const pageTitle = result.query.search[0].title;
            const pageSummary = await wikipedia.page(pageTitle).summary();
            
            // Send the summary
            await conn.sendMessage(from, {
                text: pageSummary
            }, { quoted: mek });
        } else {
            reply('No results found.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
