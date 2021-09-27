const Permissions = require("../permissions.js");

const _eyesData = [
    { "systemName": "Kourmonen", "emojiName": "johnbob" },
    { "systemName": "Lamaa", "emojiName": "pat" },
    { "systemName": "Y-MPWL", "emojiName": "really" },
    { "systemName": "Camal", "emojiName": "catgun" }
];

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.Limited };
};

exports.run = async (client, message, args) => {    
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
    
        eyesData.forEach(systemData => messageText += "**" + systemData.systemName + ":** " + systemData.currentEyes.join(" ") + "\n");
        
        messageText += `\n\n**React with:**\n`;

        eyesData.forEach( systemData => messageText += systemData.emojiIcon.toString() + " = " + systemData.systemName + "\n");
        
        return messageText;
    }
    
    var messageText = generateMessageText()
    
    message.channel.send(messageText).then(targetMessage => {
        eyesData.forEach(systemData => targetMessage.react(systemData.emojiIcon));

        client.on('messageReactionAdd', (reaction, user) => {
            if (user.bot) return;
            
            eyesData.forEach(systemData => {
                if (reaction.emoji.name === systemData.emojiIcon.name) {
                    systemData.currentEyes.push(user.username);
                    targetMessage.edit(generateMessageText());
                }
            });
        });
        
        client.on('messageReactionRemove', (reaction, user) => {
            if (user.bot) return;
            
            eyesData.forEach(systemData => {
                if (reaction.emoji.name === systemData.emojiIcon.name) {
                    systemData.currentEyes = systemData.currentEyes.filter(item => !(item === user.username));
                    targetMessage.edit(generateMessageText());
                }
            });
        });        
    });
}
