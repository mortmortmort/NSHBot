const Permissions = require("../permissions.js");
const EyesProcessor = require("../processors/eyes2.ts");

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.Public, Channel: Permissions.ChannelPermissions.Limited };
};

exports.run = async (client, message, args) => {    
    return EyesProcessor.eyesCommand(client, message, args);
}
