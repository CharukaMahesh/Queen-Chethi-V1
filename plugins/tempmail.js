const axios = require('axios');
const { cmd } = require('../command');

// Define the base URL and headers for the API requests
const API_BASE_URL = 'https://privatix-temp-mail-v1.p.rapidapi.com';
const API_KEY = 'ed5bf847a5msh967ef84bdea2589p1022c4jsn667746880e64';
const API_HOST = 'privatix-temp-mail-v1.p.rapidapi.com';

cmd({
    pattern: "tempmail",
    desc: "Generate a temporary email and fetch emails",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        // Join the arguments to determine the action (generate or fetch)
        const action = args[0];
        
        if (!action) return reply('Please specify an action: `generate` or `fetch`.');
        
        if (action === 'generate') {
            // Generate a temporary email address
            const response = await axios.get(`${API_BASE_URL}/request/domains/`, {
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': API_HOST
                }
            });
            const domain = response.data[0]; // Use the first domain from the response

            const emailResponse = await axios.get(`${API_BASE_URL}/request/mailbox/`, {
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': API_HOST
                }
            });
            const email = emailResponse.data.email;

            // Send the temporary email address to the user
            await conn.sendMessage(from, {
                text: `📧 *Your Temporary Email:* ${email}`
            }, { quoted: mek });
        } else if (action === 'fetch') {
            // Fetch emails for the provided temporary email address
            const email = args[1];
            
            if (!email) return reply('Please provide a temporary email address.');

            // Fetch the emails
            const response = await axios.get(`${API_BASE_URL}/request/email/${email}`, {
                headers: {
                    'x-rapidapi-key': API_KEY,
                    'x-rapidapi-host': API_HOST
                }
            });
            const emails = response.data;

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
