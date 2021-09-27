const PersistBotAdmin = require("./persist/persist-botadmin.js");
const PersistCommands = require("./persist/persist-commands.js");

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
				const BotAdminData = await PersistBotAdmin.readFromDisk();
				const hasRole = message.member.roles.cache.has(BotAdminData.RoleId);
				console.log("BotAdminData.RoleId = " + BotAdminData.RoleId + " hasRole = " + hasRole);
				return hasRole;

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
				const guildId = message.guild.id;
				const channelId = message.channel.id;

				const commandData = await PersistCommands.readFromDisk();
				const inList = PersistCommands.isInCommandList(commandData, guildId, channelId, command);

				console.log("PersistCommands = " + commandData + " guildId = " + guildId + " channelId = " + channelId + " inList = " + inList);
				return inList;

			case ChannelPermissions.None:
				return false;

			default:
				return false;

		};
	};

	var userPerms = await checkUserPermissions(client, message, perms);
	var channelPerms = await checkChannelPermissions(client, message, command, perms);

	return userPerms && channelPerms;
};