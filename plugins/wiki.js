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
        const result = await wikipedia.summary(query, { sentences: 2 });

        // Send the result
        await conn.sendMessage(from, {
            text: result.summary
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
