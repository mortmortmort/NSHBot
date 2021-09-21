const rp = require("request-promise");
const Discord = require("discord.js");
const countdown = require('moment-countdown');
const moment = require('moment');
const config = require("../config.json");

const eyesData = {
    "Kourmonen": { "emojiName": "johnbob" },
    "Lamaa": { "emojiName": "pat" },
    "Y-MPWL": { "emojiName": "really" },
    "Camal": { "emojiName": "catgun" }
};

exports.run = async (client, message, args) => {    
    var messageSanitized = message.content.toLowerCase();
    var command = message.content.startsWith(`${config.prefix}eyes`);
    var arg = messageSanitized.replace(`${config.prefix}eyes `, '');
    
    const kourm = message.guild.emojis.cache.find(emoji => emoji.name === 'johnbob');
    const lamaa = message.guild.emojis.cache.find(emoji => emoji.name === 'pat');
    const ymp = message.guild.emojis.cache.find(emoji => emoji.name === 'really');
    const camal = message.guild.emojis.cache.find(emoji => emoji.name === 'catgun');
    
    var messageText = `@everyone \n**Eyes Monitoring Started.**\n\n`;
    
    for (var system in eyesData) {
        messageText += "**" + system + "**\n";
    }
   
    messageText += `\n\n**React with:**\n`;

    for (var system in eyesData) {
        const emojiIcon = message.guild.emojis.cache.find(emoji => emoji.name === eyesData[system].emojiName);
        messageText += emojiIcon.toString() + " = " + system + "\n";
    }
    
    message.channel.send(messageText).then(sentEmbed => {
        sentEmbed.react(kourm)
        sentEmbed.react(lamaa)
        sentEmbed.react(ymp)
        sentEmbed.react(camal)

        client.on('messageReactionAdd', (reaction, user) => {
            if(reaction.emoji.name === kourm) {
            message.channel.send(reaction.emoji.users);
        }
    })
    });
    

}
