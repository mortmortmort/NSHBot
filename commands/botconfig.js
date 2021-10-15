const Permissions = require("../types/permissiontypes.js");
const BCP = require("../processors/botconfig");

exports.getPermissions = () => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {    
    return BCP.BotConfigProcessor.processCommand(client, message, args);
};