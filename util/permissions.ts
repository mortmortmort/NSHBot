import { UserPermissions, ChannelPermissions, Permissions } from "../types/permissiontypes";
import { BotClient } from "../botclient.js";
import { Message, Permissions as DJSPermissions } from "discord.js";

const CommandPermsProcessor = require("../processors/command-perms.js");

async function checkUserPermissions(client: BotClient, message: Message, perms: Permissions) {
	switch (perms.User) {
		case UserPermissions.Public:
			return true;

		case UserPermissions.BotAdmin:
			if (!message.member) return false;

			return message.member.permissions.has(DJSPermissions.FLAGS.ADMINISTRATOR) || 
				message.member.roles.cache.has(client.botConfig.botAdminRoleId);

		case UserPermissions.ServerAdmin:
			if (!message.member) return false;

			return message.member.permissions.has(DJSPermissions.FLAGS.ADMINISTRATOR);

		default:
			return false;
	};
};

async function checkChannelPermissions(client: BotClient, message: Message, command: string, perms: Permissions) {
	switch (perms.Channel) {
		case ChannelPermissions.All:
			return true;

		case ChannelPermissions.Limited:
			if (!message.guild) return false;

			return CommandPermsProcessor.checkPermissions(message.guild.id, message.channel.id, command);

		case ChannelPermissions.None:
			return false;

		default:
			return false;

	};
};

export async function checkPermissions(client: BotClient, message: Message, command: string, perms: Permissions) {
	var userPerms = await checkUserPermissions(client, message, perms);
	var channelPerms = await checkChannelPermissions(client, message, command, perms);

	return userPerms && channelPerms;
};