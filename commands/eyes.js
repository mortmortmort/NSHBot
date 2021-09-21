const rp = require("request-promise");
const Discord = require("discord.js");
const countdown = require('moment-countdown');
const moment = require('moment');
const config = require("../config.json");

const eyesData = [
    { "systemName": "Kourmonen", "emojiName": "johnbob" },
    { "systemName": "Lamaa", "emojiName": "pat" },
    { "systemName": "Y-MPWL", "emojiName": "really" },
    { "systemName": "Camal", "emojiName": "catgun" }
];

exports.run = async (client, message, args) => {    
    var messageSanitized = message.content.toLowerCase();
    var command = message.content.startsWith(`${config.prefix}eyes`);
    var arg = messageSanitized.replace(`${config.prefix}eyes `, '');
    
    var emojiList = [];
    
    var messageText = `@everyone \n**Eyes Monitoring Started.**\n\n`;
    
    eyesData.forEach(systemData => messageText += "**" + systemData.systemName + ":**\n");
    messageText += `\n\n**React with:**\n`;

    eyesData.forEach( systemData => {
        const emojiIcon = message.guild.emojis.cache.find(emoji => emoji.name === systemData.emojiName);
        emojiList.push(emojiIcon);
        
        messageText += emojiIcon.toString() + " = " + systemData.systemName + "\n";
    });
    
    message.channel.send(messageText).then(targetMessage => {
        emojiList.forEach(emoji => targetMessage.react(emoji));
        
        client.on('messageReactionAdd', (reaction, user) => {
            if (message.author.bot) return;
            
            console.log("messageReactionAdd(): reaction = " + reaction + ", user = " + user);
            messageText += "user: " + user.userName + "\n";
            targetMessage.edit(messageText);
        });
    });
    

}
