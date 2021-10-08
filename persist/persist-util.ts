'use strict';

import { promises as FSP } from "fs";

const DATA_PATH = "./data/";

export async function readFromDisk(filename: string, defaultFunctor: any) {
    try {
        const path = DATA_PATH + filename;
        const buffer = await FSP.readFile(path);
        return JSON.parse(buffer.toString());
    } catch (ex) {
        const defaultData = defaultFunctor();
        return defaultData;
    }
};

export async function writeToDisk(filename: string, data: any) {
    const path = DATA_PATH + filename;
    const buffer = JSON.stringify(data);
    await FSP.writeFile(path, buffer);
};