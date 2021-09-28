const PersistUtil = require("../persist/persist-util.js");

const FILENAME = "eyes.json";

async function readFromDisk() {
    return PersistUtil.readFromDisk(FILENAME, createDefaultEyesData);
};

async function writeToDisk(data) {
    return PersistUtil.writeToDisk(FILENAME, data);
};

function validateSystemData(systemName, emojiName) {
    if (systemName === undefined || systemName === "")
        return false;

    if (emojiName === undefined || emojiName === "")
        return false;

    return true;
}

function makeSystemData(systemName, emojiName) {
    return { "systemName": systemName, "emojiName": emojiName };
}

function makeEyesData() {
    return [];
}

function createDefaultEyesData() {
    return makeEyesData();
}

module.exports.addSystemToEyes = async (client, message, systemName, emoji) => {
    var emojiName;
    if (emoji.startsWith("<") && emoji.endsWith(">")) {
        // this is an emoji, format: '<:really:889720025915744286>'
        var i1 = emoji.indexOf(':') + 1;
        var i2 = emoji.indexOf(':', i1);

        emojiName = emoji.slice(i1, i2);
    } else {
        emojiName = emoji;
    }

    const emojiIcon = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);

    console.log("addCommandToChannel invoked. systemName = " + systemName + " emoji = " + emoji + " emojiName = " + emojiName);

    if (!validateSystemData(systemName, emojiName))
        return;

	var eyesData = await readFromDisk();
    
    if (eyesData.some(element => element.emojiName === emojiName)) {
        message.channel.send(`${message.author}: Error - ${emojiIcon} already in use`);
        return;
    }

    const systemData = eyesData.find(element => element.systemName === systemName);

    if (systemData === undefined) {
        eyesData.push(makeSystemData(systemName, emojiName));
        await writeToDisk(eyesData);

        message.channel.send(`${message.author}: Successfully added '${systemName}' to list with ${emojiIcon}`);
    } else {
        systemData.emojiName = emojiName;
        await writeToDisk(eyesData);

        message.channel.send(`${message.author}: Successfully updated '${systemName}' emoji to ${emojiIcon}`);
    }
};

module.exports.removeSystemFromEyes = async (client, message, systemName) => {
    console.log("removeSystemFromEyes invoked. systemName = " + systemName);

	var eyesData = await readFromDisk();
    
    const index = eyesData.findIndex(element => element.systemName === systemName);
    
    if (index !== -1) {
        eyesData.splice(index, 1);       
        await writeToDisk(eyesData);

        message.channel.send(`${message.author}: Successfully removed '${systemName}' from list`);
    }
};

function generateMessageText(eyesData) {
    var messageText;
    
    messageText = `@everyone \n**Eyes Monitoring Started.**\n\n`;

    eyesData.forEach(systemData => messageText += "**" + systemData.systemName + ":** " + systemData.currentEyes.join(" ") + "\n");
    
    messageText += `\n\n**React with:**\n`;

    eyesData.forEach( systemData => messageText += systemData.emojiIcon.toString() + " = " + systemData.systemName + "\n");
    
    return messageText;
}

module.exports.eyesCommand = async (client, message, args) => {
    // Deep copy
    const eyesDataOnDisk = await readFromDisk();
    var eyesData = JSON.parse(JSON.stringify(eyesDataOnDisk));
        
    eyesData.forEach(systemData => {
        const emojiIcon = message.guild.emojis.cache.find(emoji => emoji.name === systemData.emojiName);
        systemData["emojiIcon"] = emojiIcon;        
        systemData["currentEyes"] = [];
    });    

    var messageText = generateMessageText(eyesData)

    message.channel.send(messageText).then(targetMessage => {
        eyesData.forEach(systemData => targetMessage.react(systemData.emojiIcon));

        client.on('messageReactionAdd', (reaction, user) => {
            if (user.bot) return;
            
            eyesData.forEach(systemData => {
                if (reaction.emoji.name === systemData.emojiIcon.name) {
                    systemData.currentEyes.push(message.member.displayName);
                    targetMessage.edit(generateMessageText(eyesData));
                }
            });
        });
        
        client.on('messageReactionRemove', (reaction, user) => {
            if (user.bot) return;
            
            eyesData.forEach(systemData => {
                if (reaction.emoji.name === systemData.emojiIcon.name) {
                    systemData.currentEyes = systemData.currentEyes.filter(item => !(item === message.member.displayName));
                    targetMessage.edit(generateMessageText(eyesData));
                }
            });
        });        
    });    
}