const Permissions = require("../permissions.js");
const FSP = require("fs").promise;

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.ServerAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {  
	if (args === undefined || args.length !== 1) return;

	const guildId = message.guild.id;
	const channelId = message.channel.id;
	const command = args[0];

	console.log("addcommandtochannel invoked. command = " + command + " guildId = " + guildId + " channelId = " + channelId);
};