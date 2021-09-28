const FSP = require("fs").promises;

const DATA_PATH = "./data/";

module.exports.readFromDisk = async function(filename, defaultFunctor) {
    try {
        const path = DATA_PATH + filename;
        const buffer = await FSP.readFile(path);
        return JSON.parse(buffer);
    } catch (ex) {
        const defaultData = defaultFunctor();
        return defaultData;
    }
};

module.exports.writeToDisk = async function(filename, data) {
    const path = DATA_PATH + filename;
    const buffer = JSON.stringify(data);
    await FSP.writeFile(path, buffer, { flags: "w" });
};