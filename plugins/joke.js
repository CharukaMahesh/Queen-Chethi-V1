const { cmd } = require('../command');
const JokeAPI = require('jokeapi');

const jokeApi = new JokeAPI();

cmd({
    pattern: "joke",
    desc: "Get a random joke",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, {
    from, reply
}) => {
    try {
        // Fetch a random joke from the JokeAPI
        const joke = await jokeApi.getJoke({
            type: 'single', // single joke (no setup/punchline)
            category: 'Programming', // Change to 'Miscellaneous', 'Programming', or 'Christmas'
            lang: 'en'
        });

        // Format the joke response
        const jokeMessage = `
Here's a joke for you:

${joke.joke || 'Sorry, I couldn\'t fetch a joke at the moment.'}
        `;

        // Send the joke
        await conn.sendMessage(from, { text: jokeMessage }, { quoted: mek });
    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while fetching the joke. Please try again later.");
    }
});
