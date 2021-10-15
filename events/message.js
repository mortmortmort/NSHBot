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
exports.MessageCreateEventHandler = void 0;
const permissiontypes_1 = require("../types/permissiontypes");
const permissions_1 = require("../util/permissions");
function MessageCreateEventHandler(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ignore all bots
        if (message.author.bot)
            return;
        // Ignore messages not starting with the prefix (in config.json)
        if (message.content.indexOf(client.config.prefix) !== 0)
            return;
        // Our standard argument/command name definition.
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        let command = args.shift();
        if (!command)
            return;
        command = command.toLowerCase();
        // Grab the command data from the client.commands Enmap
        const cmd = client.commands.get(command);
        // If that command doesn't exist, silently exit and do nothing
        if (!cmd)
            return; // message.reply("that command does not exist.");
        const perms = (cmd.getPermissions) ? cmd.getPermissions() : permissiontypes_1.DefaultPermissions;
        let result = yield (0, permissions_1.checkPermissions)(client, message, command, perms);
        if (result) {
            // Run the command
            try {
                yield cmd.run(client, message, args);
            }
            catch (ex) {
                client.debug.logError(`Exception caught trying to execute '${command}' with args = '${args}'. 
                Exception text = '${ex}'
                Exception stack = '${ex.stack}'`);
            }
            ;
        }
        else {
            console.log("command did not meet permission requirements");
        }
    });
}
exports.MessageCreateEventHandler = MessageCreateEventHandler;
