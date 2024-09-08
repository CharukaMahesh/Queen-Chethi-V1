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
