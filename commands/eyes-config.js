const Permissions = require("../types/permissiontypes.js");
const EyesProcessor = require("../processors/eyes.js");

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {    
    return EyesProcessor.eyesConfigCommand(client, message, args);
}
