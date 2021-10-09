const DebugLevel = {
    OFF: "OFF",
    ERROR: "ERROR",
    DEBUG: "DEBUG",
    TRACE: "TRACE"
};




module.exports.setDebugChannel = async (client, message) => {
    client.debug.logTrace("setDebugChannel() invoked");

    client.botConfig.debugGuildId   = message.guild.id;
    client.botConfig.debugChannelId = message.channel.id;
    await client.botConfig.writeToDisk();

};

module.exports.setDebugLevel = async (client, message, level) => {
    client.debug.logTrace("setDebugLevel() invoked, level = " + level);

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
