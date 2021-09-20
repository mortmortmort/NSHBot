const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
const path = require("path");

client.config = config;
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

client.commands = new Enmap();

const recursive = function(dir, result = []) {
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

client.login(config.token);