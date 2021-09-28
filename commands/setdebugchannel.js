const Permissions = require("../permissions.js");
const DebugProcessor = require("../processors/debug.js");

exports.getPermissions = () => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {    
    if (args === undefined || args.length !== 0) return;

    return DebugProcessor.setDebugChannel(client, message);
};