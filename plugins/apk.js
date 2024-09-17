const axios = require('axios');
const fs = require('fs');
const { cmd } = require('../command');

cmd({
    pattern: "apkdownload",
    desc: "Downloads APK from a given URL or Query",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Trigger auto reaction when command is run
        await conn.sendMessage(from, {
            react: { text: "📥", key: mek.key }
        });

        // Validate input
        const query = args.join(" ");
        if (!query) {
            return reply("Please provide an APK query or download URL.");
        }

        // If the input is a URL
        const isUrl = query.startsWith("http");
        let apkUrl;
        
        if (isUrl) {
            apkUrl = query;  // Direct URL provided by the user
        } else {
            // Else treat it as a search query and simulate APK search
            // Here, replace with your actual APK query implementation
            apkUrl = `https://example.com/download?search=${encodeURIComponent(query)}`;
            // For the example, we are constructing a mock URL. You could implement an actual search functionality.
        }

        // Define the file path for saving the APK
        const fileName = "downloaded_app.apk";
        const filePath = `./downloads/${fileName}`;

        // Download the APK using Axios
        const response = await axios({
            url: apkUrl,
            method: 'GET',
            responseType: 'stream'
        });

        // Stream the response data into the file
        response.data.pipe(fs.createWriteStream(filePath));

        // Wait for the file to finish downloading
        response.data.on('end', async () => {
            await conn.sendMessage(from, { text: "APK downloaded successfully!" }, { quoted: mek });
            // Send the APK file to the chat
            await conn.sendMessage(from, { document: { url: filePath }, mimetype: 'application/vnd.android.package-archive' }, { quoted: mek });
        });

        response.data.on('error', (err) => {
            console.error("Error downloading the APK:", err);
            reply("An error occurred while downloading the APK.");
        });

    } catch (error) {
        console.error("Error:", error);
        reply("An error occurred while processing your request.");
    }
});
