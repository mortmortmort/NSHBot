const PersistUtil = require("../persist/persist-util.js");

const FILENAME = "debug.json";

const DebugLevel = {
    OFF: "OFF",
    ERROR: "ERROR",
    DEBUG: "DEBUG",
    TRACE: "TRACE"
};

function checkLevelForMessageOff(debugData) {
    return false;
}

function checkLevelForMessageError(debugData) {
    switch (debugData.debugLevel) {
        case DebugLevel.ERROR:
        case DebugLevel.DEBUG:
        case DebugLevel.TRACE:
            return true;
    }

    return false;
}

function checkLevelForMessageDebug(debugData) {
    switch (debugData.debugLevel) {
        case DebugLevel.DEBUG:
        case DebugLevel.TRACE:
            return true;
    }

    return false;
}

function checkLevelForMessageTrace(debugData) {
    switch (debugData.debugLevel) {
        case DebugLevel.TRACE:
            return true;
    }

    return false;
}

async function readFromDisk() {
    return PersistUtil.readFromDisk(FILENAME, createDefaultDebugData);
};

async function writeToDisk(data) {
    return PersistUtil.writeToDisk(FILENAME, data);
};

function makeDebugData(debugGuildId, debugChannelId, debugLevel) {
    return {
        "debugGuildId": debugGuildId,
        "debugChannelId": debugChannelId,
        "debugLevel": debugLevel
    };
}

function createDefaultDebugData() {
    return makeDebugData(undefined, undefined, DebugLevel.OFF);
}

async function messageDebugChannel(debugData, client, message, text) {
    var debugChannel = client.channels.cache.get(debugData.debugChannelId);

    if (debugChannel.guild.id !== debugData.debugGuildId) return;

    debugChannel.send(text);
}

async function logMessageError(client, message, text) {
    text = "ERROR: " + text;

    const debugData = await readFromDisk();

    if (checkLevelForMessageError(debugData)) {
        messageDebugChannel(debugData, client, message, text);
    }

    console.log(text);    
}

async function logMessageDebug(client, message, text) {
    text = "DEBUG: " + text;

    const debugData = await readFromDisk();

    if (checkLevelForMessageDebug(debugData)) {
        messageDebugChannel(debugData, client, message, text);
    }

    //console.log(text);
}

async function logMessageTrace(client, message, text) {
    text = "TRACE: " + text;

    const debugData = await readFromDisk();

    if (checkLevelForMessageTrace(debugData)) {
        messageDebugChannel(debugData, client, message, text);
    }

    //console.log(text);
}


module.exports.setDebugChannel = async (client, message) => {
    logMessageTrace(client, message, "setDebugChannel() invoked");

    const guildId = message.guild.id;
    const channelId = message.channel.id;

    var debugData = await readFromDisk();

    debugData.debugGuildId = message.guild.id;
    debugData.debugChannelId = message.channel.id;

    await writeToDisk(debugData);    
};

module.exports.setDebugLevel = async (client, message, level) => {
    logMessageTrace(client, message, "setDebugLevel() invoked, level = " + level);

    var debugLevel;
    switch (level.toUpperCase()) {
        case DebugLevel.OFF:
            debugLevel = DebugLevel.OFF;
            break;

        case DebugLevel.ERROR:
            debugLevel = DebugLevel.ERROR;
            break;
        
        case DebugLevel.DEBUG:
            debugLevel = DebugLevel.DEBUG;
            break;
                
        case DebugLevel.TRACE:
            debugLevel = DebugLevel.TRACE;                    
            break;

        default:
            return;
    }

    var debugData = await readFromDisk();

    debugData.debugLevel = debugLevel;

    await writeToDisk(debugData);        
}

module.exports.logMessageError = logMessageError;

module.exports.logMessageDebug = logMessageDebug;

module.exports.logMessageTrace = logMessageTrace;