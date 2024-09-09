const { cmd } = require('../command');

cmd({
    pattern: "add",
    desc: "Add a member to the group",
    category: "group",
    filename: __filename,
    onlyGroup: true,
    admin: true
},
async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("Please provide the number to add (with country code).");

    try {
        const number = text.includes('@s.whatsapp.net') ? text : `${text}@s.whatsapp.net`;
        await conn.groupParticipantsUpdate(from, [number], 'add');
        
        // Auto react when the command is successful
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

        reply("Member added successfully!");
    } catch (e) {
        console.error("Error adding member:", e);

        // React with a sad emoji if an error occurs
        await conn.sendMessage(from, {
            react: { text: "😞", key: mek.key }
        });

        reply("An error occurred while adding the member.");
    }
});

cmd({
    pattern: "remove",
    desc: "Remove a member from the group",
    category: "group",
    filename: __filename,
    onlyGroup: true,
    admin: true
},
async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("Please provide the number to remove (with country code).");

    try {
        const number = text.includes('@s.whatsapp.net') ? text : `${text}@s.whatsapp.net`;
        await conn.groupParticipantsUpdate(from, [number], 'remove');

        // Auto react when the command is successful
        await conn.sendMessage(from, {
            react: { text: "🗑️", key: mek.key }
        });

        reply("Member removed successfully!");
    } catch (e) {
        console.error("Error removing member:", e);

        // React with a sad emoji if an error occurs
        await conn.sendMessage(from, {
            react: { text: "😞", key: mek.key }
        });

        reply("An error occurred while removing the member.");
    }
});

cmd({
    pattern: "promote",
    desc: "Promote a member to admin",
    category: "group",
    filename: __filename,
    onlyGroup: true,
    admin: true
},
async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("Please provide the number to promote (with country code).");

    try {
        const number = text.includes('@s.whatsapp.net') ? text : `${text}@s.whatsapp.net`;
        await conn.groupParticipantsUpdate(from, [number], 'promote');

        // Auto react when the command is successful
        await conn.sendMessage(from, {
            react: { text: "⬆️", key: mek.key }
        });

        reply("Member promoted to admin!");
    } catch (e) {
        console.error("Error promoting member:", e);

        // React with a sad emoji if an error occurs
        await conn.sendMessage(from, {
            react: { text: "😞", key: mek.key }
        });

        reply("An error occurred while promoting the member.");
    }
});

cmd({
    pattern: "demote",
    desc: "Demote a member from admin",
    category: "group",
    filename: __filename,
    onlyGroup: true,
    admin: true
},
async (conn, mek, m, { from, text, reply }) => {
    if (!text) return reply("Please provide the number to demote (with country code).");

    try {
        const number = text.includes('@s.whatsapp.net') ? text : `${text}@s.whatsapp.net`;
        await conn.groupParticipantsUpdate(from, [number], 'demote');

        // Auto react when the command is successful
        await conn.sendMessage(from, {
            react: { text: "⬇️", key: mek.key }
        });

        reply("Member demoted from admin!");
    } catch (e) {
        console.error("Error demoting member:", e);

        // React with a sad emoji if an error occurs
        await conn.sendMessage(from, {
            react: { text: "😞", key: mek.key }
        });

        reply("An error occurred while demoting the member.");
    }
});
