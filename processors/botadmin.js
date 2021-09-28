const PersistUtil = require("../persist/persist-util.js");

const FILENAME = "commands.json";

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

module.exports.setBotAdmin = async (message, roleMention) => {
    console.log("setBotAdmin invoked. roleMention = " + roleMention);

    if (roleMention.startsWith("<@&") && roleMention.endsWith(">")) {
        let botAdminRole = message.guild.roles.cache.get(roleMention.slice(3, -1));
    
        if (botAdminRole !== undefined) {
            const data = makeBotAdminData(botAdminRole.id);
            await writeToDisk(data);
    
            console.log("setBotAdmin() - successfully updated botAdminData to: " + JSON.stringify(data));
        }            
    } else {
        console.log("setBotAdmin() - unexpected role mention = '" + targetRoleMention + "'");
    }
};

module.exports.checkPermissions = async (message) => {
    const BotAdminData = await readFromDisk();
    return message.member.roles.cache.has(BotAdminData.RoleId);
}