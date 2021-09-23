const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const fsp = require("fs").promises;
const config = require("./config.json");
const path = require("path");

async function getDiscordToken() {
  const data = await fsp.readFile("./discord.token");
  
  if (data && data !== undefined) {
    return data;
  }

  if (process.env.DISCORD_TOKEN) {
    return process.env.DISCORD_TOKEN;
  }
  
  throw "Unable to find Discord Bot Token. Check './discord.token' or the DISCORD_TOKEN ENV variable";
}

function recursive(dir, result = []) {
  // list files in directory and loop through
  fs.readdirSync(dir).forEach(file => {
    // builds full path of file
    const fPath = path.resolve(dir, file);
    if (fs.statSync(fPath).isDirectory()) {
      recursive(fPath, result);
    }
    result.push(fPath);
  });
};

function initEvents(client) {
  // This loop reads the /events/ folder and attaches each event file to the appropriate event.
  fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });
}

function initCommands(client) {
  let files = [];
  recursive("./commands/", files);
  files.forEach(file => {
    if (!file.endsWith(".js")) {
      return;
    }
    let props = require(file);
    let commandName = path.parse(file).name;
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
}

function initRelays() {
  let relays = [];
  recursive("./relays/", relays);
  relays.forEach(relay => {
    if (!relay.endsWith(".js")) {
      return;
    }
    let props = require(relay);
    let relayName = path.parse(relay).name;
    console.log(`Attempting to load ${relayName} relay`);
    //client.commands.set(relayName, props);
  });  
}

function init() {
  const client = new Discord.Client();
  const discord_token = await getDiscordToken();
  client.config = config;
  client.commands = new Enmap();
  
  initEvents(client);
  initCommands(client);
  //initRelays(client);

  console.log("Attempting to log in with token = " + discord_token);
  client.login(discord_token);
}

init();
