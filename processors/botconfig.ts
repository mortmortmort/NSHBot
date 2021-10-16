// NPM modules
import { Message } from "discord.js";

// Local modules
import { BotClient } from "../botclient";
import { DebugLevel, debugLevelFromString } from "../types/debugtypes";

export class BotConfigProcessor {
    static async processCommand(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`BotConfigProcessor::processCommand() invoked. args = '${args}'`);

        if (args === undefined) return this.help(client, message);

        let cmd = args.shift();
        if (cmd === undefined) return this.help(client, message);

        switch (cmd.toLowerCase()) {
            case "help":
                return this.help(client, message);

            case "setbotadmin":
                return BotConfigProcessor.setBotAdmin(client, message, args);

            case "setdebugchannel":
                return BotConfigProcessor.setDebugChannel(client, message, args);
    
            case "setdebuglevel":
                return BotConfigProcessor.setDebugLevel(client, message, args);

            case "addcommand":
                return BotConfigProcessor.addCommand(client, message, args);

            case "removecommand":
                return BotConfigProcessor.removeCommand(client, message, args);
                            

            default:
                client.debug.logDebug(`BotConfigProcessor::processCommand() => Unexpected command ('${cmd}')`);
                return;
        }
    }

    private static async help(client: BotClient, message: Message): Promise<void> {
        let text: string = "";

        text += `Available !botconfig subcommands:\n`;
        text += `\`\`\``;
        text += `!botconfig help -- print usage information\n`;
        text += `!botconfig setbotadmin <@RoleMention> -- sets <@RoleMention> as 'BotAdmin'\n`;
        text += `!botconfig setdebugchannel -- set current channel as output channel for debug message\n`;
        text += `!botconfig setdebuglevel <OFF|ERROR|DEBUG|TRACE> -- set logging verbosity\n`;
        text += `!botconfig addcommand <command> -- add <command> to whitelist for current channel\n`;
        text += `!botconfig removecommand <command> -- remove <command> from whitelist for current channel\n`;
        text += `\`\`\``;

        message.reply(text);
    }

    private static async setBotAdmin(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`BotConfigProcessor::setBotAdmin() invoked with args = '${args}'`);

        let roleMention = args.shift();
        if (roleMention === undefined) {
            client.debug.logDebug("BotConfigProcessor::setBotAdmin() => roleMention missing!");    
            return;
        }

        if (roleMention.startsWith("<@&") && roleMention.endsWith(">")) {
            if (message.guild === undefined || message.guild === null) {
                client.debug.logDebug("BotConfigProcessor::setBotAdmin() => message.guild is null/undefined!");
                return;
            }

            let botAdminRole = message.guild.roles.cache.get(roleMention.slice(3, -1));
        
            if (botAdminRole !== undefined) {
                client.botConfig.botAdminRoleId = botAdminRole.id;
                await client.botConfig.writeToDisk();
    
                message.reply(`Successfully set ${roleMention} as BotAdmin`);
            }            
        } else {
            client.debug.logError("BotConfigProcessor::setBotAdmin() => unexpected role mention = '" + roleMention + "'");
        }        
    }

    private static async setDebugChannel(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`BotConfigProcessor::setDebugChannel() invoked with args = '${args}'`);
    
        if (message.guild === undefined || message.guild === null) {
            client.debug.logDebug("BotConfigProcessor::setBotAdmin() => message.guild is null/undefined!");
            return;
        }

        if (message.channel === undefined || message.channel === null) {
            client.debug.logDebug("BotConfigProcessor::setBotAdmin() => message.channel is null/undefined!");
            return;
        }        

        client.botConfig.debugGuildId   = message.guild.id;
        client.botConfig.debugChannelId = message.channel.id;
        await client.botConfig.writeToDisk();

        message.reply(`Successfully set current channel as debug channel`);
    };

    private static async setDebugLevel(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`BotConfigProcessor::setDebugLevel() invoked with args = '${args}'`);

        let level = args.shift();
        if (level === undefined) {
            client.debug.logDebug("BotConfigProcessor::setBotAdmin() => level is undefined!");
            return;
        }

        let debugLevel: DebugLevel = debugLevelFromString(level);
    
        client.botConfig.debugLevel = debugLevel;
        await client.botConfig.writeToDisk();

        message.reply(`Successfully set debugLevel to ${debugLevel}`);
    }
    
    private static async addCommand(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`BotConfigProcessor::addCommand() invoked with args = '${args}'`);
    
        if (!message.guild) return;

        let command = args.shift();
        if (command === undefined) {
            client.debug.logDebug("BotConfigProcessor::addCommand() => command is undefined!");
            return;
        }        

        client.acl.channelAclAdd(command, message.guild.id, message.channel.id);
        await client.acl.writeToDisk();
    
        message.reply(`Added '${client.config.prefix}${command}' access to this channel`);
    }

    private static async removeCommand(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`BotConfigProcessor::removeCommand() invoked with args = '${args}'`);

        if (!message.guild) return;

        let command = args.shift();
        if (command === undefined) {
            client.debug.logDebug("BotConfigProcessor::removeCommand() => command is undefined!");
            return;
        }      

        client.acl.channelAclRemove(command, message.guild.id, message.channel.id);
        await client.acl.writeToDisk();
    
        message.reply(`Removed '${client.config.prefix}${command}' access from this channel`);
    }    
}
