// NPM modules
import { Message, MessageEmbed, MessageButton, MessageActionRow, MessageActionRowComponent, Interaction, Guild } from "discord.js";
import JSONFile from "jsonfile";
import FileExists from "file-exists";

// Local modules
import { BotClient } from "../botclient";

type EyesData = {
    systemData:    EyesSystemData[],
    activeSystems: string[],
    watching:      WatchingData
}

type EyesSystemData = {
    systemName:  string,
    regionName:  string,
    description: string,
}

type WatchingData = {
    [key: string]: string[]
}


function generateMessageEmbed(guild: Guild, eyesData: EyesData): MessageEmbed {
    const eyesEmbed = new MessageEmbed({
        title: "FCI - Eyes Request"});

    eyesData.activeSystems.forEach(systemName => {
        let systemData = eyesData.systemData.find(element => { return (element.systemName === systemName)} );

        if (!systemData) return;

        let watchers = (eyesData.watching.hasOwnProperty(systemName) ? eyesData.watching[systemName] : []);
        let watcherNames: string[] = [];
        
        watchers.forEach(userId => {
            if (guild.members) {
                let gm = guild.members.cache.find(cacheMember => cacheMember.id === userId);
                if (gm) {
                    watcherNames.push(gm.displayName);
                }                
            }
        });

        let name  = 
            `${systemData.systemName} (${systemData.regionName})`;
        let value = 
            `[Dotlan](https://evemaps.dotlan.net/map/${systemData.regionName}/${systemData.systemName})` + `\n` +
            `Description: ${systemData.description}` + `\n` +
            `Currently Watching: ${watcherNames.join(" ")}`; 

        eyesEmbed.addField(name, value)
    });

    return eyesEmbed;
}

function generateMessageButtons(eyesData: EyesData) {
    const MAX_BUTTONS_PER_ROW = 5;
    let result = [];

    for (let ii = 0; ii < eyesData.activeSystems.length; ii += MAX_BUTTONS_PER_ROW) {
        let systemsList = eyesData.activeSystems.slice(ii, ii + MAX_BUTTONS_PER_ROW);
        const row = generateMessageButtonRow(eyesData, systemsList);
        result.push(row);
    }

    return result;
}

function generateMessageButtonRow(eyesData: EyesData, systemsList: string[]) {
    let row = new MessageActionRow();

    for (let ii = 0; ii < systemsList.length; ii++) {
        let systemName = eyesData.activeSystems[ii];

        row.addComponents(new MessageButton({
            customId: `Eyes.${systemName}`,
            label:    `${systemName}`,
            style:    "PRIMARY"
        }));
    }

    return row;
}

class EyesDataPersist {
    private static readonly DATAFILE = "./data/eyes2.json";

    private static newEyesData(): EyesData {
        return {
            systemData: [ ],
            activeSystems: [ ],
            watching: {}
        };
    }


    static async readFromDisk(client: BotClient): Promise<EyesData> {
        if (!await FileExists(EyesDataPersist.DATAFILE)) {
            client.debug.logDebug(`EyesDataPersist::readFromDisk() ==> dataFile not found: ${EyesDataPersist.DATAFILE}`);
            return this.newEyesData();
        }

        try {
            const data = await JSONFile.readFile(EyesDataPersist.DATAFILE);

            let eyesData: EyesData = this.getEyesDataFromJSON(data);

            client.debug.logTrace("EyesDataPersist::readFromDisk() ==> eyesData = ", eyesData);

            return eyesData;
        } catch (ex) {
            client.debug.logError("EyesDataPersist::readFromDisk() ==> Exception caught: ", ex);
            return this.newEyesData();
        }
    }

    static async writeToDisk(client: BotClient, eyesData: EyesData): Promise<void> {
        try {
            await JSONFile.writeFile(EyesDataPersist.DATAFILE, eyesData);

            client.debug.logTrace("EyesDataPersist::writeToDisk() ==> eyesData = ", eyesData);
        } catch (ex) {
            client.debug.logError("EyesDataPersist::writeToDisk() ==> Exception caught: ", ex);
        }
    }

    static getEyesDataFromJSON(jsonData: any): EyesData {
        let result: EyesData = jsonData;

        return result;
    }

}

class EyesDataHelper {
    private _data: EyesData;

    constructor(eyesData: EyesData) {
        this._data = eyesData;
    }

    hasSystemData(systemName: string): boolean {
        let systemData = this.getSystemData(systemName);

        return (systemData !== undefined)
    }

    getSystemData(systemName: string): EyesSystemData | undefined {
        return this._data.systemData.find(element => { return (element.systemName === systemName)} );
    }    

    addSystemData(systemName: string, regionName: string, description: string): void {
        if (!this.hasSystemData(systemName)) {
            this._data.systemData.push({
                systemName: systemName,
                regionName: regionName,
                description: description
            })
        }
    }

    removeSystemData(systemName: string): void {
        let index = this._data.systemData.findIndex(element => { return (element.systemName === systemName)});

        if (index !== -1) {
            this._data.systemData.splice(index, 1);
        }
    }

    addActiveSystem(systemName: string): void {
        let index = this._data.activeSystems.indexOf(systemName);

        if (index === -1) {
            this._data.activeSystems.push(systemName);
        }
    }

    removeActiveSystem(systemName: string): void {
        let index = this._data.activeSystems.indexOf(systemName);

        if (index !== -1) {
            this._data.activeSystems.splice(index, 1);
        }        
    }

    isWatcher(systemName: string, userId: string): boolean {
        if (!this._data.watching.hasOwnProperty(systemName)) {
            return false;
        }

        let systemWatchers = this._data.watching[systemName];
        let index = systemWatchers.indexOf(userId);

        return (index !== -1);
    }

    addWatcher(systemName: string, userId: string): void {
        if (!this._data.watching.hasOwnProperty(systemName)) {
            this._data.watching[systemName] = [ ];
        }

        let systemWatchers = this._data.watching[systemName];
        let index = systemWatchers.indexOf(userId);

        if (index === -1) {
            systemWatchers.push(userId);
        }        
    }

    removeWatcher(systemName: string, userId: string): void {
        if (!this._data.watching.hasOwnProperty(systemName)) {
            return;
        }        

        let systemWatchers = this._data.watching[systemName];
        let index = systemWatchers.indexOf(userId);

        if (index !== -1) {
            systemWatchers.splice(index, 1);
        }             
    }
}

export class EyesProcessor {
    static async processCommand(client: BotClient, message: Message, args: string[]): Promise<void> {
        if (!message.guild) return;

        let data = await EyesDataPersist.readFromDisk(client);
        let helper = new EyesDataHelper(data);

        const eyesEmbed = generateMessageEmbed(message.guild, data);
        const eyesComponents = generateMessageButtons(data);

        let eyesMessage = await message.channel.send({ embeds: [ eyesEmbed ], components: eyesComponents });

        let collector = eyesMessage.createMessageComponentCollector();
        
        collector.on('collect', (interaction: Interaction) => {
            if (!interaction.isButton()) return;
            if (!interaction.member || !interaction.guild) return;

            let systemName = "Camal";
            let userId = interaction.member.user.id;

            if (!helper.isWatcher(systemName, userId)) {
                helper.addWatcher(systemName, userId);
                interaction.reply( { content: `Added as watcher for ${systemName}`, ephemeral: true });
            } else {
                helper.removeWatcher(systemName, userId);
                interaction.reply( { content: `Removed as watcher for ${systemName}`, ephemeral: true });
            }

            const eyesEmbed = generateMessageEmbed(interaction.guild, data);

            eyesMessage.edit({ embeds: [eyesEmbed] });
        });        
    }
};

export class EyesConfigProcessor {
    static async processCommand(client: BotClient, message: Message, args: string[]): Promise<void> {
        if (!message.guild) return;

        client.debug.logTrace(`EyesConfigProcessor::processConfigCommand() invoked. args = '${args}'`);

        if (args === undefined) return this.help(client, message);

        let cmd = args.shift();
        if (cmd === undefined) return this.help(client, message);

        switch (cmd.toLowerCase()) {
            case "help":
                return this.help(client, message);

            case "addsystem":
                return EyesConfigProcessor.addSystem(client, message, args);

            case "removesystem":
                return EyesConfigProcessor.removeSystem(client, message, args);
    
            case "addactive":
                return EyesConfigProcessor.addActive(client, message, args);

            case "removeactive":
                return EyesConfigProcessor.removeActive(client, message, args);
    

            default:
                client.debug.logDebug(`EyesConfigProcessor::processCommand() => Unexpected command ('${cmd}')`);
                return;
        }

    }

    private static async help(client: BotClient, message: Message): Promise<void> {
        let text: string = "";

        text += `Available !eyes-config subcommands:\n`;
        text += `\`\`\``;
        text += `!eyes-config help -- print usage information\n`;
        text += `!eyes-config addsystem <system> <region> <description> -- adds <system> to tracking'\n`;
        text += `!eyes-config removesystem <system> -- removes <system> from tracking\n`;
        text += `!eyes-config addactive <system> -- adds <system> to active tracking'\n`;
        text += `!eyes-config removeactive <system> -- removes <system> from active tracking\n`;
        text += `\`\`\``;

        message.reply(text);
    }

    private static async addSystem(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`EyesConfigProcessor::addSystem() invoked with args = '${args}'`);

        if (args.length < 3) {
            client.debug.logDebug(`EyesConfigProcessor::addSystem() invoked with wrong number of args = '${args}'`);
            return this.help(client, message);
        }

        let systemName = args.shift();
        let regionName = args.shift();
        let description = args.join(" ");

        if (systemName === undefined || regionName === undefined || description === undefined) return this.help(client, message);

        let data = await EyesDataPersist.readFromDisk(client);
        let helper = new EyesDataHelper(data);

        helper.addSystemData(systemName, regionName, description);

        await EyesDataPersist.writeToDisk(client, data);
    }
    
    private static async removeSystem(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`EyesConfigProcessor::removeSystem() invoked with args = '${args}'`);    

        if (args.length < 1) {
            client.debug.logDebug(`EyesConfigProcessor::removeSystem() invoked with wrong number of args = '${args}'`);
            return this.help(client, message);
        }

        let systemName = args.shift();

        if (systemName === undefined) return this.help(client, message);

        let data = await EyesDataPersist.readFromDisk(client);
        let helper = new EyesDataHelper(data);

        helper.removeSystemData(systemName);

        await EyesDataPersist.writeToDisk(client, data);        
    }

    private static async addActive(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`EyesConfigProcessor::addActive() invoked with args = '${args}'`);    

        if (args.length < 1) {
            client.debug.logDebug(`EyesConfigProcessor::addActive() invoked with wrong number of args = '${args}'`);
            return this.help(client, message);
        }

        let systemName = args.shift();

        if (systemName === undefined) return this.help(client, message);

        let data = await EyesDataPersist.readFromDisk(client);
        let helper = new EyesDataHelper(data);

        helper.addActiveSystem(systemName);

        await EyesDataPersist.writeToDisk(client, data);                
    }    

    private static async removeActive(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`EyesConfigProcessor::removeActive() invoked with args = '${args}'`);    

        if (args.length < 1) {
            client.debug.logDebug(`EyesConfigProcessor::removeActive() invoked with wrong number of args = '${args}'`);
            return this.help(client, message);
        }

        let systemName = args.shift();

        if (systemName === undefined) return this.help(client, message);

        let data = await EyesDataPersist.readFromDisk(client);
        let helper = new EyesDataHelper(data);

        helper.removeActiveSystem(systemName);

        await EyesDataPersist.writeToDisk(client, data);        
    }       
};