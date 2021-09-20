const rp = require("request-promise");
const Discord = require("discord.js");
const countdown = require('moment-countdown');
const moment = require('moment');


exports.run = async (client, message, args) => {
    message.reply(`It is ${moment.utc(moment()).format("HH:mm")} EVE`).catch(console.error);
}