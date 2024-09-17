const { cmd } = require('../command');
const QRCode = require('qrcode');

cmd({
    pattern: "qrcode2",
    desc: "Generate a QR code for the given text",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, q }) => {
    try {
        // Auto-react when command is triggered
        await conn.sendMessage(from, {
            react: { text: "📊", key: mek.key }
        });

        // Check if there's text to encode
        if (!q) {
            return reply("Please provide the text to generate a QR code.");
        }

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(q);

        // Prepare buttons
        const buttonMessage = {
            text: "What would you like to do next?",
            footer: "Choose an option below:",
            buttons: [
                { buttonId: 'generate_another', buttonText: { displayText: 'Generate Another QR Code' }, type: 1 },
                { buttonId: 'cancel', buttonText: { displayText: 'Cancel' }, type: 1 }
            ],
            headerType: 1
        };

        // Send QR code image
        await conn.sendMessage(from, {
            image: { url: qrCodeUrl },
            caption: 'Here is your QR code!',
            buttons: buttonMessage.buttons,
            footer: buttonMessage.footer
        }, { quoted: mek });

        // Handle button responses
        conn.on('buttonsResponseMessage', async (buttonResponse) => {
            const { selectedButtonId } = buttonResponse;
            if (selectedButtonId === 'generate_another') {
                // Ask for new input
                await conn.sendMessage(from, 'Please provide new text for QR code generation.');
            } else if (selectedButtonId === 'cancel') {
                // Cancel operation
                await conn.sendMessage(from, 'QR code generation canceled.');
            }
        });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
