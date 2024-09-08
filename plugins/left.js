const { cmd } = require('../command');

cmd({
    pattern: "left",
    desc: "Make the bot leave the group",
    category: "tools",
    filename: __filename,
    group: true // Ensure this command can only be used in groups
},
async (conn, mek, m, {
    from, isGroup, reply, sender, isAdmin
}) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("This command can only be used in a group chat.");
        
        // Check if the user who issued the command is an admin
        const isBotAdmin = await conn.groupMetadata(from).then(metadata => {
            return metadata.participants.some(participant => participant.id === conn.user.jid && participant.isAdmin);
        });
        
        if (!isAdmin && !isBotAdmin) return reply("Only group admins or the bot itself can use this command.");

        // React with 👋 when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "👋", key: mek.key }
        });

        // Send a farewell message
        await conn.sendMessage(from, {
            text: "Goodbye everyone! 👋"
        });

        // Make the bot leave the group
        await conn.groupLeave(from);

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
