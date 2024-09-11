const translate = require('google-translate-api');
const { cmd } = require('../command');

cmd({
    pattern: "translate",
    desc: "Translate text to a specified language",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // React with 🚀 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        // Check if user provided both text and language code
        if (args.length < 2) {
            reply("Please provide the text and the target language code. Example: `.translate Hello es`");
            return;
        }

        // Extract the language code and text to translate
        const targetLang = args.pop(); // Extract the last argument as the target language code
        const textToTranslate = args.join(' '); // Join the rest as the text to translate

        // Translate the text
        const res = await translate(textToTranslate, { to: targetLang });

        // Send the translated text
        await conn.sendMessage(from, {
            text: `*Original Text:* ${textToTranslate}\n\n*Translated Text:* ${res.text}`
        }, { quoted: mek });

        // React with 📡 when translation is done
        await conn.sendMessage(from, {
            react: { text: "📡", key: mek.key }
        });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while translating. Please try again later.");
    }
});
