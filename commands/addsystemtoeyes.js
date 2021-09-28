const Permissions = require("../permissions.js");
const EyesProcessor = require("../processors/eyes.js");

exports.getPermissions = () => {
    return { User: Permissions.UserPermissions.BotAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {  
	if (args === undefined || args.length !== 2) return;

	return EyesProcessor.addSystemToEyes(client, message, args[0], args[1]);
};