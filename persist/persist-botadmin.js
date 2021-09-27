const FSP = require("fs").promises;

const PATH_TO_DATAFILE = "./data/botadmin.json";

function makeBotAdminData(roleId) {
    return {
        "RoleId": roleId
    };
}

function createDefaultBotAdminData() {
    return makeBotAdminData("");
}

module.exports.makeBotAdminData = makeBotAdminData;

module.exports.readFromDisk = async function() {
    try {
        const BotAdminDataBuffer = await FSP.readFile(PATH_TO_DATAFILE);
        return JSON.parse(BotAdminDataBuffer);
    } catch (ex) {
        const BotAdminData = createDefaultBotAdminData();
        return BotAdminData;
    }
};

module.exports.writeToDisk = async function(botAdminData) {
    const buffer = JSON.stringify(botAdminData);
    await FSP.writeFile(PATH_TO_DATAFILE, buffer, { flags: "w" });
};