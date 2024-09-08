const axios = require('axios');
const { cmd } = require('../command');

const API_BASE_URL = 'https://tempmail.lol/api';

cmd({
    pattern: "tempmail",
    desc: "Generate a temporary email address and fetch emails",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        // Join the arguments to form the action (generate or fetch)
        const action = args[0];
        
        if (!action) return reply('Please specify an action: `generate` or `fetch`.');
        
        if (action === 'generate') {
            // Generate a temporary email address
            const response = await axios.post(`${API_BASE_URL}/generate`);
            const email = response.data.email;
            
            // Send the temporary email address to the user
            await conn.sendMessage(from, {
                text: `📧 *Your Temporary Email:* ${email}`
            }, { quoted: mek });
        } else if (action === 'fetch') {
            // Fetch the temporary email
            const email = args[1];
            
            if (!email) return reply('Please provide a temporary email address to fetch emails for.');

            const response = await axios.get(`${API_BASE_URL}/emails/${email}`);
            const emails = response.data.emails;

            if (emails.length > 0) {
                let emailMessages = emails.map((mail, index) => `
*Email #${index + 1}*
*From:* ${mail.from}
*Subject:* ${mail.subject}
*Body:* ${mail.body}
                `).join('\n\n');

                // Send the email messages to the user
                await conn.sendMessage(from, {
                    text: emailMessages || 'No emails found for the provided address.'
                }, { quoted: mek });
            } else {
                reply('No emails found for the provided address.');
            }
        } else {
            reply('Invalid action. Please use `generate` or `fetch`.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
