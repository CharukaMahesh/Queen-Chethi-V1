const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

//_______________________
//📜--------HIRU NEWS-------📜//

cmd({
    pattern: "hirunews",
    desc: "Get the latest news from Hiru News",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply
}) => {
    try {
        // React with 📰 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📰", key: mek.key }
        });

        // Scrape the latest news from Hiru News
        const url = 'https://www.hirunews.lk'; // Hiru News homepage URL
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        let newsHeadlines = [];
        $('.news-list > .news-box h2 a').each((index, element) => {
            const headline = $(element).text().trim();
            const link = $(element).attr('href');
            newsHeadlines.push({
                headline,
                link: `https://www.hirunews.lk${link}`
            });
        });

        // Construct the news message
        if (newsHeadlines.length > 0) {
            let newsMessage = "📰 𝗧𝗼𝗽 𝗡𝗲𝘄𝘀 𝗳𝗿𝗼𝗺 𝗛𝗶𝗿𝘂 𝗡𝗲𝘄𝘀 📰\n\n";
            newsHeadlines.slice(0, 5).forEach((news, index) => { // Get the top 5 news
                newsMessage += `${index + 1}. ${news.headline}\n🔗 ${news.link}\n\n`;
            });

            // Send the news message
            await conn.sendMessage(from, {
                text: newsMessage
            }, { quoted: mek });
        } else {
            reply("No news found at This Time⏰.");
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while fetching the news. Please try again later.");
    }
});
