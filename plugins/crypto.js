const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "crypto",
    desc: "Get live cryptocurrency prices",
    category: "finance",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        // Extract the cryptocurrency symbol from the message
        const args = m.message.text.split(' ');
        const crypto = args[1]?.toLowerCase();
        if (!crypto) {
            return reply("Please provide a cryptocurrency symbol (e.g., BTC, ETH).");
        }

        // Fetch the live price from CoinGecko
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: crypto,
                vs_currencies: 'usd'
            }
        });

        // Extract price data
        const data = response.data[crypto];
        if (!data) {
            return reply("Invalid cryptocurrency symbol or data not available.");
        }

        // Send the price information
        await conn.sendMessage(from, {
            text: `💰 *Live Price of ${crypto.toUpperCase()}*:\n\nUSD: $${data.usd}`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
