const { cmd } = require('../command');
const HiruNewsScraper = require('hirunews-scrap');

cmd({
    pattern: "hirunews",
    desc: "Get the latest news from Hiru News",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        // Auto-react with an emoji
        await conn.sendMessage(from, {
            react: { text: "🗞️", key: mek.key }
        });

        // Create an instance of the HiruNewsScraper
        const scraper = new HiruNewsScraper();

        // Debug log: Start fetching news
        console.log("Fetching news...");

        // Fetch the latest news
        const news = await scraper.getLatestNews();

        // Debug log: Print the fetched news data
        console.log("News fetched:", news);

        if (news && news.length > 0) {
            let newsMessage = 'Latest news:\n\n';
            news.forEach(article => {
                newsMessage += `*${article.title}*\n${article.description}\n${article.url}\n\n`;
            });

            // Send the news
            await conn.sendMessage(from, { text: newsMessage }, { quoted: mek });
        } else {
            reply("No news found.");
        }
    } catch (e) {
        // Debug log: Print the error
        console.error("Error:", e);

        reply("An error occurred while fetching news. Please try again later.");
    }
});
