const PersistUtil = require("../persist/persist-util.js");

const FILENAME = "commands.json";

async function readFromDisk() {
    return PersistUtil.readFromDisk(FILENAME, createDefaultCommandData);
};

async function writeToDisk(data) {
    return PersistUtil.writeToDisk(FILENAME, data);
};

function makeCommandData() {
    return {
        
    };
}

function createDefaultCommandData() {
    return makeCommandData();
}

function getCommandList(commandData, guildId, channelId) {
    if (!commandData.hasOwnProperty(guildId)) {
        commandData[guildId] = { };
    }

    if (!commandData[guildId].hasOwnProperty(channelId)) {
        commandData[guildId][channelId] = [];
    }

    return commandData[guildId][channelId];
}

function isInCommandList(commandData, guildId, channelId, command) {
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

module.exports.addCommandToChannel = async (guildId, channelId, command) => {
	console.log("addCommandToChannel invoked. command = " + command + " guildId = " + guildId + " channelId = " + channelId);

	var commandData = await readFromDisk();

	var currentChannelCommands = getCommandList(commandData, guildId, channelId);

	if (currentChannelCommands.indexOf(command) === -1) {
		currentChannelCommands.push(command);
	}

	await writeToDisk(commandData);
};

module.exports.removeCommandFromChannel = async (guildId, channelId, command) => {
	console.log("removeCommandFromChannel invoked. command = " + command + " guildId = " + guildId + " channelId = " + channelId);

	var commandData = await readFromDisk();

	if (isInCommandList(commandData, guildId, channelId, command)) {
		var currentChannelCommands = getCommandList(commandData, guildId, channelId);

		currentChannelCommands.splice(currentChannelCommands.indexOf(command));
	
		await writeToDisk(commandData);	
	}
};

module.exports.checkPermissions = async (guildId, channelId, command) => {
    const commandData = await readFromDisk();
    return isInCommandList(commandData, guildId, channelId, command);
};


