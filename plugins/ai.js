const config = require('../config')
const { cmd, commands } = require('../command')
const { fetchJson } = require('../lib/functions')

// Function to send a reaction
const sendReaction = async (conn, chatId, emoji) => {
    try {
        await conn.sendMessage(chatId, { react: { text: emoji, key: chatId } })
    } catch (e) {
        console.log('Error sending reaction:', e)
    }
}

cmd({
    pattern: "ai",
    desc: "ai chat bot",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Send reaction
        await sendReaction(conn, from, '🧭')  // React with the 🧭 emoji

        let data = await fetchJson(`https://chatgptforprabath-md.vercel.app/api/gptv1?q=${q}`)
        return reply(`${data.data}`)
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
