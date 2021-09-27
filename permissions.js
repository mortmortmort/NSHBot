const PersistBotAdmin = require("./persist/persist-botadmin.js");

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

module.exports.checkPermissions = async (client, message, perms) => {
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

	async function checkChannelPermissions(client, message, perms) {
		switch (perms.Channel) {
			case ChannelPermissions.All:
				return true;

			case ChannelPermissions.Limited:
				return true;

			case ChannelPermissions.None:
				return false;

			default:
				return false;

		};
	};

	var userPerms = await checkUserPermissions(client, message, perms);
	var channelPerms = await checkChannelPermissions(client, message, perms);

	return userPerms && channelPerms;
};