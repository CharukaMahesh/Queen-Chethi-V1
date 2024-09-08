const weather = require('weather-js');
const { cmd } = require('../command');

cmd({
    pattern: "weather",
    desc: "Get weather information for a city",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, args, reply
}) => {
    try {
        // React with 🌤️ when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🌤️", key: mek.key }
        });

        if (!args.length) {
            return reply("Please provide a city name to get weather information.");
        }

        const city = args.join(" ");
        console.log("City:", city);

        // Fetch weather data using weather-js
        weather.find({ search: city, degreeType: 'C' }, function(err, result) {
            if (err || !result.length) {
                console.error("Error:", err);
                return reply(`Sorry, I couldn't find the weather information for "${city}". Please try again.`);
            }

            const weatherData = result[0];
            const weatherInfo = `
🌤️ *Weather in ${weatherData.location.name}* 🌤️
    
*Temperature*: ${weatherData.current.temperature}°C
*Sky*: ${weatherData.current.skytext}
*Feels Like*: ${weatherData.current.feelslike}°C
*Humidity*: ${weatherData.current.humidity}%
*Wind*: ${weatherData.current.winddisplay}
*Observation Time*: ${weatherData.current.observationtime}
`;

            // Send the weather information
            conn.sendMessage(from, {
                text: weatherInfo
            }, { quoted: mek });
        });

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});
