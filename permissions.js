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


module.exports.checkPermissions = (client, message, perms) => {
	function checkUserPermissions(client, message, perms) {
		switch (perms.User) {
			case UserPermissions.Public:
				return true;

			case UserPermissions.BotAdmin:
				return true;

			case UserPermissions.ServerAdmin:
				return message.member.hasPermission("ADMINISTRATOR");

			default:
				return false;
		};
	};

	function checkChannelPermissions(client, message, perms) {
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

	return checkUserPermissions(client, message, perms) && checkUserPermissions(client, message, perms);
};