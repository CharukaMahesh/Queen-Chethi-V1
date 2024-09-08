const { cmd } = require('../command');
const axios = require('axios');

//_____________

//🌤️--------WEATHER-INFO-------🌤️//

cmd({
    pattern: "weather",
    desc: "Get weather information",
    category: "information",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, reply
}) => {
    try {
        if (!q) return reply("Please provide a valid city name... 🌆");

        // React with 🌤️ when the command is triggered
        await conn.sendMessage(from, {
            react: { text: "🌤️", key: mek.key }
        });

        // Fetch weather data using an API (e.g., OpenWeatherMap)
        const apiKey = "06969e817454ef76756c9d0817431e4b"; // Replace with your API key
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`;

        const response = await axios.get(weatherUrl);
        const weatherData = response.data;

        if (!weatherData || !weatherData.main) {
            return reply("Failed to retrieve weather information. Please check the city name.");
        }

        // Construct the weather information message
        let weatherInfo = `
🌤️ 𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐄𝐓𝐇𝐈 𝐖𝐄𝐀𝐓𝐇𝐄𝐑 𝐈𝐍𝐅𝐎 🌤️

*CITY* 🏙️: ${weatherData.name}

*WEATHER* 🌈: ${weatherData.weather[0].description}

*TEMPERATURE* 🌡️: ${weatherData.main.temp}°C

*HUMIDITY* 💧: ${weatherData.main.humidity}%

*WIND SPEED* 🌬️: ${weatherData.wind.speed} m/s

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀʀᴜᴋᴀ ᴍᴀʜᴇꜱʜ*
        `;

        await conn.sendMessage(from, {
            text: weatherInfo
        }, { quoted: mek });
    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while processing your request. Please try again later.");
    }
});

/////////SECOND/////////


l
