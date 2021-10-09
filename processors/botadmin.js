const PersistUtil = require("../persist/persist-util.js");


module.exports.setBotAdmin = async (client, message, roleMention) => {
    client.debug.logTrace("setBotAdmin() invoked. roleMention = " + roleMention);

    if (roleMention.startsWith("<@&") && roleMention.endsWith(">")) {
        let botAdminRole = message.guild.roles.cache.get(roleMention.slice(3, -1));
    
        if (botAdminRole !== undefined) {
            client.botConfig.botAdminRoleId = botAdminRole.id;
            await client.botConfig.writeToDisk();

            message.channel.send(`${message.author}: Successfully set ${roleMention} as BotAdmin`);
        }            
    } else {
        client.debug.logError("setBotAdmin() - unexpected role mention = '" + roleMention + "'");
    }
};

module.exports.checkPermissions = async (client, message) => {
    return message.member.roles.cache.has(client.botConfig.botAdminRoleId);
}