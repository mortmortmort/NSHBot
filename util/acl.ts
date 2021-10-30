// NPM modules
import JSONFile from "jsonfile";
import FileExists from "file-exists";

// Local modules
import { BotDebug } from "../util/botdebug";

type ACLData = {
    [key: string]: ACLCommandData
}

type ACLCommandData = {
    command: string,
    channel: ACLChannelData,
    user:    ACLUserData,
}

type ACLChannelData = {
    // key: guildId -> [ channelId ]
    [key: string]: string[]
}

type ACLUserData = {

}

function ACLData_hasCommandData(aclData: ACLData, command: string): boolean {
    return aclData.hasOwnProperty(command);
}

function ACLData_getCommandData(aclData: ACLData, command: string): ACLCommandData {
    if (!ACLData_hasCommandData(aclData, command)) {
        let commandData: ACLCommandData = {
            command: command,
            channel: { },
            user:    { }
        }

        aclData[command] = commandData;
    }

    return aclData[command];
}

function ACLChannelData_hasGuildData(aclChannelData: ACLChannelData, guildId: string): boolean {
    return aclChannelData.hasOwnProperty(guildId);
}

function ACLChannelData_getGuildData(aclChannelData: ACLChannelData, guildId: string): string[] {
    if (!ACLChannelData_hasGuildData(aclChannelData, guildId)) {
        aclChannelData[guildId] = [ ];
    } 

    return aclChannelData[guildId];
}

function ACLChannelData_hasGuildChannel(aclChannelData: ACLChannelData, guildId: string, channelId: string): boolean {
    if (!ACLChannelData_hasGuildData(aclChannelData, guildId)) 
        return false;

    let guildData = ACLChannelData_getGuildData(aclChannelData, guildId);
    let channelIndex = guildData.indexOf(channelId);

    return (channelIndex !== -1);
}

function ACLChannelData_addGuildChannel(aclChannelData: ACLChannelData, guildId: string, channelId: string): void {
    let guildData = ACLChannelData_getGuildData(aclChannelData, guildId);
    let channelIndex = guildData.indexOf(channelId);

    if (channelIndex === -1) {
        guildData.push(channelId);
    }
}

function ACLChannelData_removeGuildChannel(aclChannelData: ACLChannelData, guildId: string, channelId: string): void {
    if (!ACLChannelData_hasGuildData(aclChannelData, guildId)) 
        return;

    let guildData = ACLChannelData_getGuildData(aclChannelData, guildId);
    let channelIndex = guildData.indexOf(channelId);

    if (channelIndex !== -1) {
        guildData.splice(channelIndex, 1);
    }
}


function ACLData_sanitize(aclData: ACLData): void {
    for (let key in aclData) {
        let aclCommandData = aclData[key];

        ACLChannelData_sanitize(aclCommandData.channel);
        ACLUserData_sanitize(aclCommandData.user);

        if (Object.keys(aclCommandData.channel).length === 0 && Object.keys(aclCommandData.user).length === 0) {
            delete aclData[key];
        }
    }
}

function ACLChannelData_sanitize(aclChannelData: ACLChannelData): void {
    for (let key in aclChannelData) {
        let guildData = aclChannelData[key];

        if (guildData.length === 0) {
            delete aclChannelData[key];
        }
    }    
}

function ACLUserData_sanitize(aclUserData: ACLUserData): void {
    
}

export class ACL {
    private static readonly DATAFILE = "./data/acl.json";

    private _debug: BotDebug;
    private _data: ACLData;

    constructor(debug: BotDebug) {
        this._debug = debug;
        this._data = {
        };
    }

    private setValuesFromJSON(data: any) {
        this._data = data;
    }

    async readFromDisk(): Promise<void> {
        if (!await FileExists(ACL.DATAFILE)) {
            this._debug.logDebug(`ACL::readFromDisk() ==> dataFile not found: ${ACL.DATAFILE}`);
            return;
        }

        try {
            const data = await JSONFile.readFile(ACL.DATAFILE);

            this.setValuesFromJSON(data);

            this._debug.logTrace("ACL::readFromDisk() ==> data = ", this._data);
        } catch (ex) {
            this._debug.logError("ACL::readFromDisk() ==> Exception caught: ", ex);
        }
    }

    readFromDiskSync(): void {
        if (!FileExists.sync(ACL.DATAFILE)) {
            this._debug.logDebug(`ACL::readFromDiskSync() ==> dataFile not found: ${ACL.DATAFILE}`);
            return;
        }

        try {
            const data = JSONFile.readFileSync(ACL.DATAFILE);

            this.setValuesFromJSON(data);

            this._debug.logTrace("ACL::readFromDiskSync() ==> data = ", this._data);
        } catch (ex) {
            this._debug.logError("ACL::readFromDiskSync() ==> Exception caught: ", ex);
        }
    }

    async writeToDisk(): Promise<void> {
        try {
            await JSONFile.writeFile(ACL.DATAFILE, this._data);

            this._debug.logTrace("ACL::writeToDisk() ==> data = ", this._data);
        } catch (ex) {
            this._debug.logError("ACL::writeToDisk() ==> Exception caught: ", ex);
        }
    }    


    channelAclAdd(command: string, guildId: string, channelId: string): void {
        let channelData = ACLData_getCommandData(this._data, command).channel;

        ACLChannelData_addGuildChannel(channelData, guildId, channelId);
    }

    channelAclRemove(command: string, guildId: string, channelId: string): void {
        if (!ACLData_hasCommandData(this._data, command)) {
            // No record for this command -- NOOP
            return;
        }

        let channelData = ACLData_getCommandData(this._data, command).channel;

        if (!ACLChannelData_hasGuildData(channelData, guildId)) {
            // No record for this guild -- NOOP
            return;
        } 

        ACLChannelData_removeGuildChannel(channelData, guildId, channelId);

        ACLData_sanitize(this._data);
    }

    channelAclCheckPermission(command: string, guildId: string, channelId: string): boolean {
        if (!ACLData_hasCommandData(this._data, command)) {
            // No record for this command
            return false;
        }

        let channelData = ACLData_getCommandData(this._data, command).channel;
        
        return ACLChannelData_hasGuildChannel(channelData, guildId, channelId);
    }
};
