import JSONFile from "jsonfile";

import { DebugLevel } from "../types/debugtypes";

type BotConfigData = {
    debugLevel: DebugLevel;
    debugGuildId: string;
    debugChannelId: string;
    botAdminRoleId: string;
}

export class BotConfig {
    private static readonly DATAFILE = "./data/botconfig.json";

    private _data: BotConfigData;

    constructor() {
        this._data = {
            debugLevel:      DebugLevel.OFF,
            debugGuildId:    "",
            debugChannelId:  "",
            botAdminRoleId: ""
        };
    }

    private setValuesFromJSON(data: any) {
        if (data.hasOwnProperty("debugLevel")) {
            this._data.debugLevel = data.debugLevel;
        }
        
        if (data.hasOwnProperty("debugGuildId")) {
            this._data.debugGuildId = data.debugGuildId;
        }
        
        if (data.hasOwnProperty("debugChannelId")) {
            this._data.debugChannelId = data.debugChannelId;
        }
        
        if (data.hasOwnProperty("botAdminRoleId")) {
            this._data.botAdminRoleId = data.botAdminRoleId;
        }
    }

    async readFromDisk(): Promise<void> {
        try {
            const data = JSONFile.readFileSync(BotConfig.DATAFILE);

            this.setValuesFromJSON(data);

            console.log("BotConfig::readFromDisk() ==> data = ", data);
        } catch (ex) {
            console.log(ex);
        }
    }

    readFromDiskSync(): void {
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
            await JSONFile.writeFile(BotConfig.DATAFILE, this._data);

            console.log("BotConfig::writeToDisk() ==> data = ", this._data);
        } catch (ex) {
            console.log(ex);
        }
    }

    get debugLevel(): DebugLevel {
        return this._data.debugLevel;
    }

    set debugLevel(debugLevel: DebugLevel) {
        this._data.debugLevel = debugLevel;
    }    

    get debugGuildId(): string {
        return this._data.debugGuildId;
    }

    set debugGuildId(debugGuildId: string) {
        this._data.debugGuildId = debugGuildId;
    }    

    get debugChannelId(): string {
        return this._data.debugChannelId;
    }

    set debugChannelId(debugChannelId: string) {
        this._data.debugChannelId = debugChannelId;
    }

    get botAdminRoleId(): string {
        return this._data.botAdminRoleId;
    }

    set botAdminRoleId(botAdminRoleId: string) {
        this._data.botAdminRoleId = botAdminRoleId;
    }
}