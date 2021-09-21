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
    
    var emojiList = [];
    
    var messageText = `@everyone \n**Eyes Monitoring Started.**\n\n`;
    
    for (var system in eyesData) {
        messageText += "**" + system + ":**\n";
    }
   
    messageText += `\n\n**React with:**\n`;

    for (var system in eyesData) {
        const emojiIcon = message.guild.emojis.cache.find(emoji => emoji.name === eyesData[system].emojiName);
        emojiList.push(emojiIcon);
        
        messageText += emojiIcon.toString() + " = " + system + "\n";
    }
    
    message.channel.send(messageText).then(targetMessage => {
        emojiList.forEach(emoji => targetMessage.react(emoji));
        
        client.on('messageReactionAdd', (reaction, user) => {
            if (message.author.bot) return;
            
            console.log("messageReactionAdd(): reaction = " + reaction + ", user = " + user);
            messageText += "user: " + user.userName + \n";
            targetMessage.edit(messageText);
        });
    });
    

}
