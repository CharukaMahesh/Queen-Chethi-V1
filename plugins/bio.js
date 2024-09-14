const { cmd } = require('../command');
let autobioEnabled = false; // Variable to track if autobio is on or off
let defaultBio = "HI QUEEN CHETHI MD ONLINE POWERED BY CHARUKA MAHESH📡"; // Default bio

// Function to format the current date and time
function getCurrentTimeAndDate() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false }); // HH:mm:ss format
    const date = now.toLocaleDateString(); // MM/DD/YYYY format
    return `${time} | ${date}`;
}

// Enable auto bio
cmd({
    pattern: "autobio",
    desc: "Enable auto bio updates with current time and date",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, from }) => {
    try {
        autobioEnabled = true;

        // Set initial bio with the current time and date
        await conn.setStatus(`${defaultBio} | ${getCurrentTimeAndDate()}`);

        // Auto-react with 🚀 emoji when autobio is enabled
        await conn.sendMessage(from, {
            react: { text: "🚀", key: mek.key }
        });

        reply(`Autobio has been enabled. Current bio: "${defaultBio} | ${getCurrentTimeAndDate()}"`);
    } catch (e) {
        console.error("Error enabling autobio:", e);
        reply("An error occurred while enabling autobio. Please try again later.");
    }
});

// Disable auto bio
cmd({
    pattern: "autobioff",
    desc: "Disable auto bio updates",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, from }) => {
    try {
        autobioEnabled = false;

        // Auto-react with 🛑 emoji when autobio is disabled
        await conn.sendMessage(from, {
            react: { text: "🛑", key: mek.key }
        });

        reply("Autobio has been disabled.");
    } catch (e) {
        console.error("Error disabling autobio:", e);
        reply("An error occurred while disabling autobio. Please try again later.");
    }
});

// Set custom bio
cmd({
    pattern: "setbio",
    desc: "Set a custom bio",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { args, reply, from }) => {
    try {
        if (args.length === 0) {
            reply("Please provide a custom bio to set. Example: `.setbio [Your bio]`");
            return;
        }

        const customBio = args.join(' '); // Combine arguments to form the custom bio
        await conn.setStatus(`${customBio} | ${getCurrentTimeAndDate()}`);

        // Auto-react with 📡 emoji when bio is set
        await conn.sendMessage(from, {
            react: { text: "📡", key: mek.key }
        });

        reply(`Bio updated successfully to: "${customBio} | ${getCurrentTimeAndDate()}"`);

    } catch (e) {
        console.error("Error setting bio:", e);
        reply("An error occurred while updating the bio. Please try again later.");
    }
});

// Automatically update bio if autobio is enabled
async function autoUpdateBio(conn) {
    if (autobioEnabled) {
        try {
            const updatedBio = `${defaultBio} | ${getCurrentTimeAndDate()}`;
            await conn.setStatus(updatedBio);
        } catch (e) {
            console.error("Error auto updating bio:", e);
        }
    }
}

// Periodically update the bio with current time and date every minute (you can change this to your preferred interval)
setInterval(() => {
    if (autobioEnabled) {
        autoUpdateBio();
    }
}, 60000); // 1 minute interval

module.exports = {
    autoUpdateBio
};
