"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPermissions = exports.ChannelPermissions = exports.UserPermissions = void 0;
var UserPermissions;
(function (UserPermissions) {
    UserPermissions[UserPermissions["Public"] = 0] = "Public";
    UserPermissions[UserPermissions["BotAdmin"] = 1] = "BotAdmin";
    UserPermissions[UserPermissions["ServerAdmin"] = 2] = "ServerAdmin";
})(UserPermissions = exports.UserPermissions || (exports.UserPermissions = {}));
;
var ChannelPermissions;
(function (ChannelPermissions) {
    ChannelPermissions[ChannelPermissions["All"] = 0] = "All";
    ChannelPermissions[ChannelPermissions["Limited"] = 1] = "Limited";
    ChannelPermissions[ChannelPermissions["None"] = 2] = "None";
})(ChannelPermissions = exports.ChannelPermissions || (exports.ChannelPermissions = {}));
;
exports.DefaultPermissions = {
    User: UserPermissions.Public,
    Channel: ChannelPermissions.All
};
