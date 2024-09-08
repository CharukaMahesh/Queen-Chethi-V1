const { cmd } = require('../command');
const puppeteer = require('puppeteer');
const fs = require('fs');

cmd({
    pattern: "screenshot",
    desc: "Take a screenshot of a given URL",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, text
}) => {
    try {
        // Auto-react with an emoji
        await conn.sendMessage(from, {
            react: { text: "📸", key: mek.key }
        });

        if (!text) {
            return reply('Please provide a URL to capture the screenshot.');
        }

        // Launch Puppeteer browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the given URL
        await page.goto(text, { waitUntil: 'networkidle2' });

        // Capture the screenshot
        const screenshotPath = `./screenshot.png`;
        await page.screenshot({ path: screenshotPath });

        // Close the browser
        await browser.close();

        // Send the screenshot
        await conn.sendMessage(from, {
            image: fs.readFileSync(screenshotPath),
            caption: "Here is the screenshot of the provided URL."
        }, { quoted: mek });

        // Clean up the screenshot file
        fs.unlinkSync(screenshotPath);

    } catch (e) {
        console.error("Error capturing screenshot:", e);
        reply("An error occurred while capturing the screenshot. Please try again later.");
    }
});
