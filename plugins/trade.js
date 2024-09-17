const { cmd } = require('../command');
const Binance = require('binance-api-node').default;

// Initialize the Binance client
const client = Binance();

// Fetch and send Binance signals (simple price fetch)
cmd({
    pattern: "binance",
    desc: "Get Binance signals (buy/sell recommendations)",
    category: "crypto",
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, q, reply }) => {
    try {
        if (!args[0]) {
            return reply("Please provide the cryptocurrency symbol (e.g., BTCUSDT, ETHUSDT).");
        }

        const symbol = args[0].toUpperCase();
        
        // Fetch the price of the given symbol
        const price = await client.prices({ symbol });

        if (!price[symbol]) {
            return reply("Invalid cryptocurrency symbol or not found.");
        }

        const currentPrice = price[symbol];
        reply(`The current price of ${symbol} is $${currentPrice}.`);

        // Add simple signals based on price (You can implement a more complex strategy)
        const buySignalThreshold = 100; // Example threshold for signals
        if (currentPrice < buySignalThreshold) {
            reply(`🔔 Buy signal for ${symbol}! Price is $${currentPrice}.`);
        } else {
            reply(`⚠️ No buy signal for ${symbol}. Price is $${currentPrice}.`);
        }

    } catch (error) {
        console.error(error);
        reply("An error occurred while fetching Binance data.");
    }
});
