// NPM modules
import { Client, ClientOptions, Intents } from "discord.js";

// Local modules
import { BotConfig } from "./util/botconfig";
import { BotDebug } from "./util/botdebug";
import { ACL } from "./util/acl";

//import * as Enmap from "enmap";
//import Enmap from "enmap";
const Enmap  = require("enmap");



export class BotClient extends Client {
    commands: typeof Enmap;
    config: any;
    botConfig: BotConfig;
    debug: BotDebug;
    acl: ACL;

    constructor() {
        let options: ClientOptions = {
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ]
        };
        super(options);
        
        this.commands = new Enmap();
        this.config = {};
        this.botConfig = new BotConfig();
        this.debug     = new BotDebug(this, this.botConfig);
        this.acl       = new ACL(this.debug);
    }

    initialize() {
        this.botConfig.readFromDisk();
        this.acl.readFromDiskSync();
    }
}
