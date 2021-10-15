"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const permissiontypes_1 = require("../types/permissiontypes");
const discord_js_1 = require("discord.js");
const CommandPermsProcessor = require("../processors/command-perms.js");
function checkUserPermissions(client, message, perms) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (perms.User) {
            case permissiontypes_1.UserPermissions.Public:
                return true;
            case permissiontypes_1.UserPermissions.BotAdmin:
                if (!message.member)
                    return false;
                return message.member.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR) ||
                    message.member.roles.cache.has(client.botConfig.botAdminRoleId);
            case permissiontypes_1.UserPermissions.ServerAdmin:
                if (!message.member)
                    return false;
                return message.member.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR);
            default:
                return false;
        }
        ;
    });
}
;
function checkChannelPermissions(client, message, command, perms) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (perms.Channel) {
            case permissiontypes_1.ChannelPermissions.All:
                return true;
            case permissiontypes_1.ChannelPermissions.Limited:
                if (!message.guild)
                    return false;
                return CommandPermsProcessor.checkPermissions(message.guild.id, message.channel.id, command);
            case permissiontypes_1.ChannelPermissions.None:
                return false;
            default:
                return false;
        }
        ;
    });
}
;
function checkPermissions(client, message, command, perms) {
    return __awaiter(this, void 0, void 0, function* () {
        var userPerms = yield checkUserPermissions(client, message, perms);
        var channelPerms = yield checkChannelPermissions(client, message, command, perms);
        return userPerms && channelPerms;
    });
}
exports.checkPermissions = checkPermissions;
;
