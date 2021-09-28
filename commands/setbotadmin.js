const Permissions = require("../permissions.js");
const BotAdminProcessor = require("../processors/botadmin.js");

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.ServerAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {    
    if (args === undefined || args.length !== 1) return;

    return BotAdminProcessor.setBotAdmin(message, args[0]);
};