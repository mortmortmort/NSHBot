const PersistUtil = require("./persist-util");

const FILENAME = "commands.json";

function makeCommandData() {
    return {
        
    };
}

function createDefaultCommandData() {
    return makeCommandData();
}

module.exports.makeCommandData = makeCommandData;
module.exports.getCommandList = (commandData, guildId, channelId) => {
    if (!commandData.hasOwnProperty(guildId)) {
        commandData[guildId] = { };
    }

    if (!commandData[guildId].hasOwnProperty(channelId)) {
        commandData[guildId][channelId] = [];
    }

    return commandData[guildId][channelId];
}

module.exports.isInCommandList = (commandData, guildId, channelId, command) => {
    if (!commandData.hasOwnProperty(guildId)) {
        return false;
    }

    if (!commandData[guildId].hasOwnProperty(channelId)) {
        return false;
    }

    if (commandData[guildId][channelId].indexOf(command) === -1) {
		return false;
	}

    return true;
};

module.exports.readFromDisk = async function() {
    return PersistUtil.readFromDisk(FILENAME, createDefaultCommandData);
};

module.exports.writeToDisk = async function(data) {
    return PersistUtil.writeToDisk(FILENAME, data);
};