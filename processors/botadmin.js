const PersistUtil = require("../persist/persist-util.js");
const DebugProcessor = require("../processors/debug.js");

const FILENAME = "botadmin.json";

async function readFromDisk() {
    return PersistUtil.readFromDisk(FILENAME, createDefaultBotAdminData);
};

async function writeToDisk(data) {
    return PersistUtil.writeToDisk(FILENAME, data);
};

function makeBotAdminData(roleId) {
    return {
        "RoleId": roleId
    };
}

function createDefaultBotAdminData() {
    return makeBotAdminData("");
}

module.exports.setBotAdmin = async (client, message, roleMention) => {
    client.debug.logTrace("setBotAdmin() invoked. roleMention = " + roleMention);

    if (roleMention.startsWith("<@&") && roleMention.endsWith(">")) {
        let botAdminRole = message.guild.roles.cache.get(roleMention.slice(3, -1));
    
        if (botAdminRole !== undefined) {
            const data = makeBotAdminData(botAdminRole.id);
            await writeToDisk(data);
    
            client.debug.logTrace("setBotAdmin() - successfully updated botAdminData to: " + JSON.stringify(data));
            message.channel.send(`${message.author}: Successfully set ${roleMention} as BotAdmin`);
        }            
    } else {
        client.debug.logError("setBotAdmin() - unexpected role mention = '" + roleMention + "'");
    }
};

module.exports.checkPermissions = async (message) => {
    const BotAdminData = await readFromDisk();
    return message.member.roles.cache.has(BotAdminData.RoleId);
}