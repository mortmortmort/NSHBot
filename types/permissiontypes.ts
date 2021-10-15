export enum UserPermissions {
	Public      = 0,
	BotAdmin    = 1,
	ServerAdmin = 2
};

export enum ChannelPermissions {
	All     = 0,
	Limited = 1,
	None    = 2
};

export type Permissions = {
    User: UserPermissions;
    Channel: ChannelPermissions;
}

export const DefaultPermissions: Permissions = {
	User: UserPermissions.Public,
	Channel: ChannelPermissions.All
};