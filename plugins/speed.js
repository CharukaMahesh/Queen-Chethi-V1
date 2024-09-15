const speedTest = require('speedtest-net');
const { cmd } = require('../command');

cmd({
    pattern: "internetspeed",
    desc: "Check your internet speed",
    category: "utilities",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    try {
        // React with 📡 when the command is triggered
        await conn.sendMessage(m.from, {
            react: { text: "📡", key: mek.key }
        });

        // Start the speed test
        const test = speedTest({ acceptLicense: true, acceptGdpr: true });

        test.on('data', data => {
            // Extract download, upload, and ping speeds
            const downloadSpeed = (data.download.bandwidth / 125000).toFixed(2); // Mbps
            const uploadSpeed = (data.upload.bandwidth / 125000).toFixed(2); // Mbps
            const ping = data.ping.latency.toFixed(2); // ms

            // Send the speed test results
            const speedResults = `
🌐 *Internet Speed Test Results* 🌐
    
    🔸 *Download Speed*: ${downloadSpeed} Mbps
    🔸 *Upload Speed*: ${uploadSpeed} Mbps
    🔸 *Ping*: ${ping} ms
            `;

            reply(speedResults);
        });

        test.on('error', err => {
            console.error("Error occurred during speed test:", err);
            reply("An error occurred while checking your internet speed. Please try again later.");
        });

    } catch (err) {
        console.error("An error occurred:", err);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
