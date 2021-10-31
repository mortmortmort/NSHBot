const Permissions = require("../types/permissiontypes.js");
const Processor = require("../processors/legacycommands");

exports.getPermissions = () => {
    return { User: Permissions.UserPermissions.Public, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {
    return Processor.LegacyCommands.extract(client, message, args);
};