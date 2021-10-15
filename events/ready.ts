import { BotClient } from "../botclient.js";

export async function ReadyEventHandler(client: BotClient) {
  // Make the bot "play the game" which is the help command with default prefix.
  if (client.user) {
    client.user.setActivity("with your mom", {type: "PLAYING"});
  }
    
  console.log("I am ready!");

  client.debug.logTrace("I am READY!");
};