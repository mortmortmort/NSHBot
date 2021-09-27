const PersistUtil = require("./persist-util");

const FILENAME = "botadmin.json";

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
    return PersistUtil.readFromDisk(FILENAME, createDefaultBotAdminData);
};

module.exports.writeToDisk = async function(botAdminData) {
    return PersistUtil.writeToDisk(FILENAME, botAdminData);
};