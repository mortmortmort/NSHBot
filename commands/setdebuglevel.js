const Permissions = require("../permissions.js");
const DebugProcessor = require("../processors/debug.js");

exports.getPermissions = () => {
    return { User: Permissions.UserPermissions.ServerAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {    
    if (args === undefined || args.length !== 1) return;

    return DebugProcessor.setDebugLevel(client, message, args[0]);
};