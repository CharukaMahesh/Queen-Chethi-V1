const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

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
        await conn.sendMessage(from, {
            react: { text: "📰", key: mek.key }
        });

        const url = 'https://www.hirunews.lk';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Log the HTML structure you're targeting
        console.log($('.news-list').html());

        let newsHeadlines = [];
        $('.news-list > .news-box h2 a').each((index, element) => {
            const headline = $(element).text().trim();
            const link = $(element).attr('href');

            if (headline && link) {
                newsHeadlines.push({
                    headline,
                    link: `https://www.hirunews.lk${link}`
                });
            }
        });

        // Log the scraped headlines to check the output
        console.log(newsHeadlines);

        if (newsHeadlines.length > 0) {
            let newsMessage = "📰 𝗧𝗼𝗽 𝗡𝗲𝘄𝘀 𝗳𝗿𝗼𝗺 𝗛𝗶𝗿𝘂 𝗡𝗲𝘄𝘀 📰\n\n";
            newsHeadlines.slice(0, 5).forEach((news, index) => {
                newsMessage += `${index + 1}. ${news.headline}\n🔗 ${news.link}\n\n`;
            });

            await conn.sendMessage(from, {
                text: newsMessage
            }, { quoted: mek });
        } else {
            reply("No news found.");
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while fetching the news. Please try again later.");
    }
});
