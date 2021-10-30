import { Client, TextChannel } from "discord.js";

import { BotConfig } from "../util/botconfig";
import { DebugLevel } from "../types/debugtypes";

export class BotDebug {
    private readonly _discordClient: Client;
    private readonly _botConfig: BotConfig;
    

    constructor(client: Client, botConfig: BotConfig) {
        this._discordClient = client;
        this._botConfig = botConfig;
    }

    private checkLevelForMessageOff(): boolean {
        return false;
    }
        
    private checkLevelForMessageError(): boolean {
        switch (this._botConfig.debugLevel) {
            case DebugLevel.ERROR:
            case DebugLevel.DEBUG:
            case DebugLevel.TRACE:
                return true;
        }
    
        return false;
    }

    private checkLevelForMessageDebug(): boolean {
        switch (this._botConfig.debugLevel) {
            case DebugLevel.DEBUG:
            case DebugLevel.TRACE:
                return true;
        }
    
        return false;
    }

    private checkLevelForMessageTrace(): boolean {
        switch (this._botConfig.debugLevel) {
            case DebugLevel.TRACE:
                return true;
        }
    
        return false;
    }

    private async messageDebugChannel(text: any[]) {
        let debugChannel: TextChannel = this._discordClient.channels.cache.get(this._botConfig.debugChannelId) as TextChannel;
    
        let message: string = text.map(element => { return typeof element === "string" ? element : JSON.stringify(element)}).join(" ");

        if (debugChannel !== undefined) {
            if (debugChannel.guild.id !== this._botConfig.debugGuildId) return;
    
            await debugChannel.send(message);
        }
    }

    async logError(...text: any[]): Promise<void> {
        text.unshift("ERROR:");
    
        if (this.checkLevelForMessageError()) {
            await this.messageDebugChannel(text);
        }
    
        console.log.apply(console, text);
    }
    
    async logDebug(...text: any[]): Promise<void> {
        text.unshift("DEBUG:");
    
        if (this.checkLevelForMessageDebug()) {
            await this.messageDebugChannel(text);
        }
    
        console.log.apply(console, text);
    }
    
    async logTrace(...text: any[]): Promise<void> {
        text.unshift("TRACE:");
    
        if (this.checkLevelForMessageTrace()) {
            await this.messageDebugChannel(text);
        }
    
        console.log.apply(console, text);
    }
}