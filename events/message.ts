import { Message } from "discord.js";
import { BotClient } from "../botclient";
import { Permissions, DefaultPermissions } from "../types/permissiontypes";
import { checkPermissions } from "../util/permissions";

export async function MessageCreateEventHandler(client: BotClient, message: Message) {
    // Ignore all bots
    if (message.author.bot) return;

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);

    let command = args.shift();
    
    if (!command) return;

    command = command.toLowerCase();

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return; // message.reply("that command does not exist.");

    const perms: Permissions = (cmd.getPermissions) ? cmd.getPermissions() : DefaultPermissions;

    let result: Boolean = await checkPermissions(client, message, command, perms);

    if (result) {
        // Run the command
        try {
            await cmd.run(client, message, args)
        } catch (ex: any) {
            client.debug.logError(
                `Exception caught trying to execute '${command}' with args = '${args}'. 
                Exception text = '${ex}'
                Exception stack = '${ex.stack}'`);
        };            
    } else {
        console.log("command did not meet permission requirements");
    }    
}
