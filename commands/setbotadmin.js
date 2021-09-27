const Permissions = require("../permissions.js");
const PersistBotAdmin = require("../persist/persist-botadmin.js");

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.ServerAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {    
    if (args.length === 1) {
        const targetRoleMention = args[0];

        if (targetRoleMention.startsWith("<@&") && targetRoleMention.endsWith(">")) {
            let botAdminRole = message.guild.roles.cache.get(targetRoleMention.slice(3, -1));

            if (botAdminRole !== undefined) {
                const BotAdminData = PersistBotAdmin.makeBotAdminData(botAdminRole.id);
                await PersistBotAdmin.writeToDisk(BotAdminData);

                console.log("SetBotAdmin::run() - successfully updated BotAdminData to: " + JSON.stringify(BotAdminData));
            }            
        } else {
            console.log("SetBotAdmin::run() - unexpected role mention = '" + targetRoleMention + "'");
        }


    } else {
        console.log("SetBotAdmin::run() - unexpected number of args = '" + args + "'");
    }
};