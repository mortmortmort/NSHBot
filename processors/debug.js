const PersistUtil = require("../persist/persist-util.js");

const FILENAME = "debug.json";

const DebugLevel = {
    OFF: "OFF",
    ERROR: "ERROR",
    DEBUG: "DEBUG",
    TRACE: "TRACE"
};

function checkLevelForMessageOff(debugLevel) {
    return false;
}

function checkLevelForMessageError(debugLevel) {
    switch (debugLevel) {
        case DebugLevel.ERROR:
        case DebugLevel.DEBUG:
        case DebugLevel.TRACE:
            return true;
    }

    return false;
}

function checkLevelForMessageDebug(debugLevel) {
    switch (debugLevel) {
        case DebugLevel.DEBUG:
        case DebugLevel.TRACE:
            return true;
    }

    return false;
}

function checkLevelForMessageTrace(debugLevel) {
    switch (debugLevel) {
        case DebugLevel.TRACE:
            return true;
    }

    return false;
}

async function messageDebugChannel(client, message, text) {
    var debugChannel = client.channels.cache.get(client.botConfig.debugChannelId);

    if (debugChannel.guild.id !== client.botConfig.debugGuildId) return;

    debugChannel.send(text);
}

async function logMessageError(client, message, text) {
    text = "ERROR: " + text;

    if (checkLevelForMessageError(client.botConfig.debugLevel)) {
        messageDebugChannel(client, message, text);
    }

    console.log(text);    
}

async function logMessageDebug(client, message, text) {
    text = "DEBUG: " + text;

    if (checkLevelForMessageDebug(client.botConfig.debugLevel)) {
        messageDebugChannel(client, message, text);
    }

    console.log(text);
}

async function logMessageTrace(client, message, text) {
    text = "TRACE: " + text;

    if (checkLevelForMessageTrace(client.botConfig.debugLevel)) {
        messageDebugChannel(client, message, text);
    }

    console.log(text);
}


module.exports.setDebugChannel = async (client, message) => {
    logMessageTrace(client, message, "setDebugChannel() invoked");

    client.botConfig.debugGuildId   = message.guild.id;
    client.botConfig.debugChannelId = message.channel.id;
    await client.botConfig.writeToDisk();

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

    client.botConfig.debugLevel = debugLevel;
    await client.botConfig.writeToDisk();
}

module.exports.logMessageError = logMessageError;

module.exports.logMessageDebug = logMessageDebug;

module.exports.logMessageTrace = logMessageTrace;