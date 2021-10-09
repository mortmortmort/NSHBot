import { Client } from "discord.js";
import JSONFile from "jsonfile";
//import * as Enmap from "enmap";
//import Enmap from "enmap";
const Enmap  = require("enmap");

import { DebugLevel } from "./types/debugtypes";

type BotConfigAsJSON = {
    debugLevel: DebugLevel;
    debugGuildId: string;
    debugChannelId: string;
}

export class BotConfig {
    private static readonly DATAFILE = "./data/botconfig.json";

    private _debugLevel: DebugLevel;
    private _debugGuildId: string;
    private _debugChannelId: string;


    constructor() {
        this._debugLevel = DebugLevel.OFF;
        this._debugGuildId = "";
        this._debugChannelId = "";
    }

    private serializeToJSON(): BotConfigAsJSON {
        return {
            debugLevel:     this._debugLevel,
            debugGuildId:   this._debugGuildId,
            debugChannelId: this._debugChannelId
        }
    }

    private setValuesFromJSON(data: any) {
        if (data.hasOwnProperty("debugLevel")) {
            this._debugLevel = data.debugLevel;
        }
        
        if (data.hasOwnProperty("debugGuildId")) {
            this._debugGuildId = data.debugGuildId;
        }
        
        if (data.hasOwnProperty("debugChannelId")) {
            this._debugChannelId = data.debugChannelId;
        }        
    }

    readFromDisk(): void {
        try {
            const data = JSONFile.readFileSync(BotConfig.DATAFILE);

            this.setValuesFromJSON(data);

            console.log("BotConfig::readFromDisk() ==> data = ", data);
        } catch (ex) {
            console.log(ex);
        }
    }

    async writeToDisk(): Promise<void> {
        try {
            const data = this.serializeToJSON();
            await JSONFile.writeFile(BotConfig.DATAFILE, data);

            console.log("BotConfig::writeToDisk() ==> data = ", data);
        } catch (ex) {
            console.log(ex);
        }
    }

    get debugLevel(): DebugLevel {
        return this._debugLevel;
    }

    set debugLevel(debugLevel: DebugLevel) {
        this._debugLevel = debugLevel;
    }    

    get debugGuildId(): string {
        return this._debugGuildId;
    }

    set debugGuildId(debugGuildId: string) {
        this._debugGuildId = debugGuildId;
    }    

    get debugChannelId(): string {
        return this._debugChannelId;
    }

    set debugChannelId(debugChannelId: string) {
        this._debugChannelId = debugChannelId;
    }

}

export class BotClient extends Client {
    commands: typeof Enmap;
    config: any;
    botConfig: BotConfig;

    constructor() {
        super();
        this.commands = new Enmap();
        this.config = {};
        this.botConfig = new BotConfig();
    }
}
