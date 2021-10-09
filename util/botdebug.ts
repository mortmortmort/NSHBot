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

    private async messageDebugChannel(text: string) {
        let debugChannel: TextChannel = this._discordClient.channels.cache.get(this._botConfig.debugChannelId) as TextChannel;
        
    
        if (debugChannel !== undefined) {
            if (debugChannel.guild.id !== this._botConfig.debugGuildId) return;
    
            debugChannel.send(text);
        }
    }

    async logError(text: string): Promise<void> {
        text = "ERROR: " + text;
    
        if (this.checkLevelForMessageError()) {
            await this.messageDebugChannel(text);
        }
    
        console.log(text);    
    }
    
    async logDebug(text: string): Promise<void> {
        text = "DEBUG: " + text;
    
        if (this.checkLevelForMessageDebug()) {
            await this.messageDebugChannel(text);
        }
    
        console.log(text);
    }
    
    async logTrace(text: string): Promise<void> {
        text = "TRACE: " + text;
    
        if (this.checkLevelForMessageTrace()) {
            await this.messageDebugChannel(text);
        }
    
        console.log(text);
    }
}