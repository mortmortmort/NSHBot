import { Client } from "discord.js";
//import { Enmap } from "enmap";
const Enmap  = require("enmap");

import { DebugLevel } from "./types/debugtypes";

export class BotConfig {
    debugLevel: DebugLevel;
    debugGuildId: "";
    debugChannelId: "";

    constructor() {
        this.debugLevel = DebugLevel.OFF;
        this.debugGuildId = "";
        this.debugChannelId = "";
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
