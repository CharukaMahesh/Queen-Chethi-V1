const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
    pattern: "aiimg",
    desc: "Generate a logo with custom text",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, reply, args
}) => {
    try {
        // Get the text from the command arguments
        const text = args.join(' ');
        if (!text) return reply('Please provide text to generate the logo.');

        // React with 🎨 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🎨", key: mek.key }
        });

        // Make a request to the FlamingText API to generate the logo
        const response = await fetch(`https://flamingtext.com/net-fu/proxy_form.cgi?script=logo&text=${encodeURIComponent(text)}&imageoutput=true`);
        
        if (!response.ok) throw new Error('Failed to generate logo');

        // Get the URL of the generated logo image
        const logoUrl = response.url;

        // Send the logo image
        await conn.sendMessage(from, {
            image: { url: logoUrl },
            caption: `Here is your logo for "${text}"!`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});






/*const { cmd } = require('../command');
const canvacord = require('canvacord');
const fs = require('fs');

cmd({
    pattern: "logo",
    desc: "Create a custom logo with provided text",
    category: "media",
    filename: __filename
},
async (conn, mek, m, {
    from, text, reply
}) => {
    try {
        // Auto-react with an emoji
        await conn.sendMessage(from, {
            react: { text: "🎨", key: mek.key }
        });

        if (!text) {
            return reply("Please provide text to create the logo.");
        }

        // Create the logo using Canvacord
        let logo = await canvacord.Canvas.welcome(text, "Your Custom Logo", "background.png");
        let buffer = await logo.toBuffer();

        // Save the image to a file
        const filePath = './logo.png';
        fs.writeFileSync(filePath, buffer);

        // Send the generated logo
        await conn.sendMessage(from, {
            image: { url: filePath },
            caption: "Here is your custom logo! 🎨"
        }, { quoted: mek });

        // Clean up the file
        fs.unlinkSync(filePath);

    } catch (e) {
        console.error("Error creating logo:", e);
        reply("An error occurred while creating the logo. Please try again later.");
    }
});
*/
