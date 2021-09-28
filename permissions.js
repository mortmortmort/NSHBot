const BotAdminProcessor = require("./processors/botadmin.js");
const CommandPermsProcessor = require("./processors/command-perms.js");

const UserPermissions = {
	Public: 0,
	BotAdmin: 1,
	ServerAdmin: 2
};

const ChannelPermissions = {
	All: 0,
	Limited: 1,
	None: 2
};

const DefaultPermissions = {
	User: UserPermissions.Public,
	Channel: ChannelPermissions.All
};

module.exports.UserPermissions = UserPermissions;
module.exports.ChannelPermissions = ChannelPermissions;
module.exports.DefaultPermissions = DefaultPermissions;

module.exports.checkPermissions = async (client, message, command, perms) => {
	async function checkUserPermissions(client, message, perms) {
		switch (perms.User) {
			case UserPermissions.Public:
				return true;

			case UserPermissions.BotAdmin:
				return message.member.hasPermission("ADMINISTRATOR") || BotAdminProcessor.checkPermissions(message);

			case UserPermissions.ServerAdmin:
				return message.member.hasPermission("ADMINISTRATOR");

			default:
				return false;
		};
	};

	async function checkChannelPermissions(client, message, command, perms) {
		switch (perms.Channel) {
			case ChannelPermissions.All:
				return true;

			case ChannelPermissions.Limited:
				return CommandPermsProcessor.checkPermissions(message.guild.id, message.channel.id, command);

			case ChannelPermissions.None:
				return false;

			default:
				return false;

		};
	};

	if (perms === undefined) {
		perms = DefaultPermissions;
	}

	var userPerms = await checkUserPermissions(client, message, perms);
	var channelPerms = await checkChannelPermissions(client, message, command, perms);

	return userPerms && channelPerms;
};