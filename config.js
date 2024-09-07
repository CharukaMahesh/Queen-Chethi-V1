const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "vO4WBShC#QY0gR_z-Eaejdg7TySs-HGZ-xP9JSRxCxwdqMQEn-pY",
ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/F002YLx/20240906-190337.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "`HI NICE TO MEET YOU..`🧬🙋‍♂️",
};
