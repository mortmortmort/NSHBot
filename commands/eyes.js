const Permissions = require("../types/permissiontypes.js");
const EyesProcessor = require("../processors/eyes.js");
const ECP = require("../processors/eyes2");

const _eyesData = [
    { "systemName": "Kourmonen", "emojiName": "johnbob" },
    { "systemName": "Lamaa", "emojiName": "pat" },
    { "systemName": "Y-MPWL", "emojiName": "really" },
    { "systemName": "Camal", "emojiName": "catgun" }
];

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.Public, Channel: Permissions.ChannelPermissions.Limited };
};

exports.run = async (client, message, args) => {    
    return ECP.EyesProcessor.processCommand(client, message, args);
    //return EyesProcessor.eyesCommand(client, message, args);
}
