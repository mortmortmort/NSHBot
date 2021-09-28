const Permissions = require("../permissions.js");
const EyesProcessor = require("../processors/eyes.js");

const _eyesData = [
    { "systemName": "Kourmonen", "emojiName": "johnbob" },
    { "systemName": "Lamaa", "emojiName": "pat" },
    { "systemName": "Y-MPWL", "emojiName": "really" },
    { "systemName": "Camal", "emojiName": "catgun" }
];

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.Limited };
};

exports.run = async (client, message, args) => {    
    return EyesProcessor.eyesCommand(client, message, args);
}
