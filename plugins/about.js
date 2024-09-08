const { cmd } = require('../command');
const fetch = require('node-fetch');  // Make sure to install node-fetch if you haven't already

cmd({
    pattern: "about",
    desc: "Displays information about the bot",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        // React with 🔬 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🔬", key: mek.key }
        });

        // Fetch GitHub repository details
        const repoUrl = 'https://api.github.com/repos/CharukaMahesh/Queen-Chethi-V1';
        const response = await fetch(repoUrl);
        const repoData = await response.json();
        const forks = repoData.forks_count;
        const stars = repoData.stargazers_count;

        // About message
        const aboutMessage = `
👸*Queen Chethi Bot*👸

*Owner & Founder*: Charuka Mahesh
*Owner*: Chethana Rajaguru

*Helpers*:
- Umesha Sathyanjali
- Naveen Pethum
- Mithila Sharada
- Sanuka Beruwala

*Deploy Your Own*:
- To deploy your own instance of Queen Chethi Bot, visit our GitHub repository: [Queen Chethi Bot](https://github.com/CharukaMahesh/Queen-Chethi-V1)

*GitHub Stats*:
- **Forks**: ${forks}
- **Stars**: ${stars}

Type *.help* to see a detailed list of all available commands and how to use them.

Thank you for using Queen Chethi Bot! 🚀
        `;

        // Image URL from GitHub
        const imageUrl = 'https://raw.githubusercontent.com/CharukaMahesh/Queen-Chethi-V1/main/Img/20240906_190337.jpg';

        // Send the image with the about message as caption
        await conn.sendMessage(from, {
            image: { url: imageUrl },  // Use the GitHub image URL
            caption: aboutMessage,      // Attach the about message as the caption
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
