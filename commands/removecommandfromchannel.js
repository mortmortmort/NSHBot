const Permissions = require("../permissions.js");
const PersistCommands = require("../persist/persist-commands.js");

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.ServerAdmin, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => {  
	if (args === undefined || args.length !== 1) return;

	const guildId = message.guild.id;
	const channelId = message.channel.id;
	const command = args[0];

	console.log("removecommandfromchannel invoked. command = " + command + " guildId = " + guildId + " channelId = " + channelId);

	var commandData = await PersistCommands.readFromDisk();

	if (PersistCommands.isInCommandList(commandData, guildId, channelId, command)) {
		var currentChannelCommands = PersistCommands.getCommandList(commandData, guildId, channelId);

		currentChannelCommands.splice(currentChannelCommands.indexOf(command));
	
		await PersistCommands.writeToDisk(commandData);	
	}
};