'use strict';

import { Client, Message, TextChannel } from "discord.js";
import { promises as FSP } from "fs";


enum DebugLevel {
    OFF   = "OFF",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
    TRACE = "TRACE"
}

class DebugData {
    debugGuildId: string;
    debugChannelId: string;
    debugLevel: DebugLevel;

    constructor(debugGuildId: string, debugChannelId: string, debugLevel: DebugLevel) {
        this.debugGuildId = debugGuildId;
        this.debugChannelId = debugChannelId;
        this.debugLevel = debugLevel;
    }

    checkLevelForMessage(debugLevel: DebugLevel): boolean {
        switch (debugLevel) {
            case DebugLevel.OFF:
                return false;

            case DebugLevel.ERROR:
                switch (this.debugLevel) {
                    case DebugLevel.ERROR:
                    case DebugLevel.DEBUG:
                    case DebugLevel.TRACE:
                        return true;
                }
            
            case DebugLevel.DEBUG:
                switch (this.debugLevel) {
                    case DebugLevel.DEBUG:
                    case DebugLevel.TRACE:
                        return true;
                }
            
            case DebugLevel.TRACE:
                switch (this.debugLevel) {
                    case DebugLevel.TRACE:
                        return true;
                }
        }

        return false;
    }
}

class DebugDataPersist {
    private static readonly DATA_PATH = "./data/";
    private static readonly FILENAME = "debug.json";

    static async readFromDisk(): Promise<DebugData> {
        const path = this.DATA_PATH + this.FILENAME;
        
        return FSP.readFile(path)
        .then((buffer) => {
            return JSON.parse(buffer.toString());
        })
        .catch(() => {
            return new DebugData("", "", DebugLevel.OFF);
        }); 
    }

    static async writeToDisk(data: DebugData): Promise<void> {
        const path = this.DATA_PATH + this.FILENAME;

        const buffer = JSON.stringify(data);
        await FSP.writeFile(path, buffer);
    }
}

export class DebugProcessor {
    private static async messageDebugChannel(debugData: DebugData, client: Client, message: Message, text: string) {
        var debugChannel = client.channels.cache.get(debugData.debugChannelId) as TextChannel;
    
        if (debugChannel === undefined) return;

        if (debugChannel.guild.id !== debugData.debugGuildId) return;
    
        debugChannel.send(text);
    }

    private static async logMessage(client: Client, message: Message, text: string, debugLevel: DebugLevel) {
        const debugData = await DebugDataPersist.readFromDisk();

        if (debugData.checkLevelForMessage(DebugLevel.ERROR)) {
            this.messageDebugChannel(debugData, client, message, text);
        }
    }

    static async logMessageError(client: Client, message: Message, text: string) {
        text = "ERROR: " + text;

        this.logMessage(client, message, text, DebugLevel.ERROR);
    
        console.log(text);    
    }

    static async logMessageDebug(client: Client, message: Message, text: string) {
        text = "DEBUG: " + text;

        this.logMessage(client, message, text, DebugLevel.DEBUG);
    
        console.log(text);    
    }

    static async logMessageTrace(client: Client, message: Message, text: string) {
        text = "TRACE: " + text;

        this.logMessage(client, message, text, DebugLevel.TRACE);
    
        console.log(text);    
    }
}

export class DebugCommandProcessor {
    static async setDebugChannel(client: Client, message: Message) {
        DebugProcessor.logMessageTrace(client, message, "setDebugChannel() invoked");
    
        if (!message.guild || !message.channel) return;

        const guildId = message.guild.id;
        const channelId = message.channel.id;
    
        var debugData = await DebugDataPersist.readFromDisk();
    
        debugData.debugGuildId = message.guild.id;
        debugData.debugChannelId = message.channel.id;
    
        await DebugDataPersist.writeToDisk(debugData);    
    };

    static async setDebugLevel(client: Client, message: Message, level: DebugLevel) {
        DebugProcessor.logMessageTrace(client, message, "setDebugLevel() invoked, level = " + level);
    
        var debugLevel;
        switch (level.toUpperCase()) {
            case DebugLevel.OFF:
                debugLevel = DebugLevel.OFF;
                break;
    
            case DebugLevel.ERROR:
                debugLevel = DebugLevel.ERROR;
                break;
            
            case DebugLevel.DEBUG:
                debugLevel = DebugLevel.DEBUG;
                break;
                    
            case DebugLevel.TRACE:
                debugLevel = DebugLevel.TRACE;                    
                break;
    
            default:
                return;
        }
    
        var debugData = await DebugDataPersist.readFromDisk();
    
        debugData.debugLevel = debugLevel;
    
        await DebugDataPersist.writeToDisk(debugData);        
    }
}