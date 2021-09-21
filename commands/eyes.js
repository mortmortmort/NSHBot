const rp = require("request-promise");
const Discord = require("discord.js");
const countdown = require('moment-countdown');
const moment = require('moment');
const config = require("../config.json");

const _eyesData = [
    { "systemName": "Kourmonen", "emojiName": "johnbob" },
    { "systemName": "Lamaa", "emojiName": "pat" },
    { "systemName": "Y-MPWL", "emojiName": "really" },
    { "systemName": "Camal", "emojiName": "catgun" }
];

exports.run = async (client, message, args) => {    
    var messageSanitized = message.content.toLowerCase();
    var command = message.content.startsWith(`${config.prefix}eyes`);
    var arg = messageSanitized.replace(`${config.prefix}eyes `, '');
    
    // deep copy
    var eyesData = JSON.parse(JSON.stringify(_eyesData));
    
    eyesData.forEach(systemData => {
        const emojiIcon = message.guild.emojis.cache.find(emoji => emoji.name === systemData.emojiName);
        systemData["emojiIcon"] = emojiIcon;        
        systemData["currentEyes"] = [];
    });    

    function generateMessageText() {
        var messageText;
        
        messageText = `@everyone \n**Eyes Monitoring Started.**\n\n`;
    
        eyesData.forEach(systemData => {
            messageText += "**" + systemData.systemName + ":** " + systemData.currentEyes.join(" ") + \n";
        });
        messageText += `\n\n**React with:**\n`;

        eyesData.forEach( systemData => messageText += systemData.emojiIcon.toString() + " = " + systemData.systemName + "\n");
    }
    
    var messageText = generateMessageText()
    
    message.channel.send(messageText).then(targetMessage => {
        eyesData.forEach(systemData => targetMessage.react(systemData.emojiIcon));

        client.on('messageReactionAdd', (reaction, user) => {
            if (user.bot) return;
            
            eyesData.forEach(systemData => {
                if (reaction == systemData.emojiIcon) {
                    console.log("messageReactionAdd(): reaction match!!!");
                }
            });
            
            console.log("messageReactionAdd(): reaction = " + reaction + ", user = " + user);
            messageText += "user: " + user.username + "\n";
            targetMessage.edit(messageText);
        });
    });
    

}
