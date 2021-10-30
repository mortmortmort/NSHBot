const Permissions = require("../types/permissiontypes.js");
const ECP = require("../processors/eyes2");

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.Limited };
};

exports.run = async (client, message, args) => {    
    return ECP.EyesConfigProcessor.processCommand(client, message, args);
}
