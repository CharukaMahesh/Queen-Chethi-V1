const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

cmd({
    pattern: "google",
    desc: "Search Google for a query",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, q, reply }) => {
    try {
        if (!q) {
            return reply("Please provide a search query.");
        }

        const searchQuery = encodeURIComponent(q);
        const url = `https://www.google.com/search?q=${searchQuery}`;

        // Fetch the Google search results page
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        const $ = cheerio.load(data);
        let searchResults = '';

        // Select top results
        $('h3').each((i, element) => {
            if (i < 5) { // Limit to top 5 results
                const title = $(element).text();
                const link = $(element).parent().attr('href');
                searchResults += `🔍 *Title*: ${title}\n🔗 *Link*: ${link}\n\n`;
            }
        });

        if (searchResults === '') {
            searchResults = 'No results found.';
        }

        // Auto-react to the command
        await conn.sendMessage(from, {
            react: { text: "🔍", key: mek.key }
        });

        // Send the search results
        await conn.sendMessage(from, {
            text: searchResults
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
