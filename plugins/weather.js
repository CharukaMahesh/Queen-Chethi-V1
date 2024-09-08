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
🌤️ 𝗤𝗨𝗘𝗘𝗡 𝗖𝗛𝗘𝗧𝗛𝗜 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗜𝗡𝗙𝗢 🌤️

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


const weather = require('weather-js');
const { cmd } = require('../command');

cmd({
    pattern: "weather1",
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

