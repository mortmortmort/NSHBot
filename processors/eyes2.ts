// NPM modules
import { Message, MessageEmbed, MessageButton, MessageActionRow, MessageActionRowComponent, Interaction, Guild } from "discord.js";

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

class EyesDataHelper {
    private _data: EyesData;

    static NewEyesData(): EyesData {
        return {
            systemData: [ ],
            activeSystems: [ ],
            watching: {}
        };
    }

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

        let data: EyesData = EyesDataHelper.NewEyesData();
        let helper: EyesDataHelper = new EyesDataHelper(data);

        helper.addSystemData("Camal", "Derelik", "PHEW Staging");
        helper.addActiveSystem("Camal");

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