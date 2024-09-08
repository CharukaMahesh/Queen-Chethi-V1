const ApkDownloader = require('apk-downloader');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

const apkDownloader = new ApkDownloader();

cmd({
    pattern: "apk",
    desc: "Download APK file for a given app name",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, reply, args
}) => {
    try {
        // Join the arguments to form the app name
        const appName = args.join(' ').trim();

        if (!appName) return reply('Please provide an app name.');

        // React with 📦 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "📦", key: mek.key }
        });

        // Perform the APK download
        const result = await apkDownloader.search(appName);

        if (result && result.length > 0) {
            const apk = result[0]; // Get the top result
            const apkUrl = apk.url; // APK download URL
            const apkTitle = apk.title; // App title

            // Create a temporary file path
            const filePath = path.join(__dirname, `${apkTitle}.apk`);

            // Download the APK file
            const response = await axios({
                url: apkUrl,
                method: 'GET',
                responseType: 'stream'
            });

            // Save the file to the disk
            response.data.pipe(fs.createWriteStream(filePath));

            response.data.on('end', async () => {
                // Send the APK file to the user
                await conn.sendMessage(from, {
                    document: fs.readFileSync(filePath),
                    mimetype: 'application/vnd.android.package-archive',
                    caption: `📦 *App Name:* ${apkTitle}\n🔗 *Download Link:* ${apkUrl}`
                }, { quoted: mek });

                // Remove the file after sending
                fs.unlinkSync(filePath);
            });
        } else {
            reply('No APK found for your query.');
        }

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while fetching the APK. Please try again later.");
    }
});
