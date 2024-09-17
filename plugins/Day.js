const { cmd } = require('../command');

// Command to get the day of the week for a given date
cmd({
    pattern: "day",
    desc: "Get the day of the week for a given date",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        // Ensure a date is provided
        if (!q) return reply("Please provide a date in YYYY-MM-DD format.");

        // Parse the date
        const date = new Date(q);
        if (isNaN(date.getTime())) return reply("Invalid date format. Please use YYYY-MM-DD.");

        // Array of day names
        const daysOfWeek = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ];

        // Get the day of the week
        const dayIndex = date.getDay();
        const dayName = daysOfWeek[dayIndex];

        // Send the response
        await conn.sendMessage(from, {
            text: `The day of the week for ${q} is ${dayName}.`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
