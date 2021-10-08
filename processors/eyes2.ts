'use strict';   

import { Client, Message } from "discord.js";
import { readFromDisk, writeToDisk } from "../persist/persist-util.js";
import { DebugProcessor } from  "../processors/debug.js";

const FILENAME = "eyes2.json";

export async function eyesCommand(client: Client, message: Message, args: Array<string>): Promise<void> {
    DebugProcessor.logMessageTrace(client, message, `eyesCommand() invoked with args = '${args}`);

}

export async function eyesConfigCommand(client: Client, message: Message, args: Array<string>): Promise<void> {
    DebugProcessor.logMessageTrace(client, message, `eyesConfigCommand() invoked with args = '${args}`);

    if (args === undefined || args.length === 0) return;
}