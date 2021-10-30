import * as FS from "fs";
import * as path from "path";
import { BotClient } from "./botclient.js";
import { ReadyEventHandler } from "./events/ready";
import { MessageCreateEventHandler } from "./events/message";

const Enmap = require("enmap");
const config = require("./config.json");

/*
const path = require("path");
require('dotenv').config()
var schedule = require('node-schedule');
const superagent = require('superagent');

//Handle Tokens
var mysql      = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

//var j = schedule.scheduleJob('* /18 * * * *', function(fireDate){


 // console.log('It has been one minute :)');
 // connection.connect();

   pool.getConnection(function (err, connection) {
     if (err) throw err;
        connection.query("SELECT * FROM users", function (err, rows) {
            connection.release();
            if (err) throw err;
rows.forEach((row) => {

  superagent
      .post('https://login.eveonline.com/v2/oauth/token')
      .send({ grant_type: 'refresh_token', refresh_token: row.refresh_token, scope: 'publicData esi-calendar.read_calendar_events.v1 esi-wallet.read_character_wallet.v1 esi-corporations.read_corporation_membership.v1 esi-corporations.read_structures.v1 esi-characters.read_corporation_roles.v1 esi-killmails.read_corporation_killmails.v1 esi-corporations.track_members.v1 esi-wallet.read_corporation_wallets.v1 esi-corporations.read_divisions.v1 esi-corporations.read_contacts.v1 esi-assets.read_corporation_assets.v1 esi-corporations.read_titles.v1 esi-corporations.read_blueprints.v1 esi-bookmarks.read_corporation_bookmarks.v1 esi-contracts.read_corporation_contracts.v1 esi-corporations.read_standings.v1 esi-corporations.read_starbases.v1 esi-industry.read_corporation_jobs.v1 esi-markets.read_corporation_orders.v1 esi-corporations.read_container_logs.v1 esi-industry.read_corporation_mining.v1 esi-planets.read_customs_offices.v1 esi-corporations.read_facilities.v1 esi-corporations.read_medals.v1 esi-corporations.read_fw_stats.v1' }) // sends a JSON post body
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Host', 'login.eveonline.com')
      .set('Authorization', `Basic ${process.env.EVE_AUTH_TOKEN}`)
      .end(function (err, res) {
               pool.getConnection(function (err, connection) {
                   connection.query(`UPDATE users SET access_token = ? WHERE char_name = '${row.char_name}'`,[res.body.access_token], function (err, res, fields) {
                   connection.release();
                   if (err) throw err;
                    });
              });
      });

            console.log(row.char_name);

})

        });
    });



});
*/

//Handle Commands

function getDiscordToken() {
  if (FS.existsSync("./secrets/discord.token")) {
    const data = FS.readFileSync("./secrets/discord.token");
  
    if (data && data !== undefined) {
      return data.toString().trim();
    }
  }

  if (process.env.DISCORD_TOKEN) {
    return process.env.DISCORD_TOKEN;
  }
  
  throw "Unable to find Discord Bot Token. Check './secrets/discord.token' or the DISCORD_TOKEN ENV variable";
}

function recursive(dir: string, result: string[] = []) {
  // list files in directory and loop through
  FS.readdirSync(dir).forEach(file => {
    // builds full path of file
    const fPath = path.resolve(dir, file);
    if (FS.statSync(fPath).isDirectory()) {
      recursive(fPath, result);
    }
    result.push(fPath);
  });
};

function initEvents(client: BotClient) {
  client.on("ready", ReadyEventHandler.bind(null, client));
  client.on("messageCreate", MessageCreateEventHandler.bind(null, client));

  return;
}

function initCommands(client: BotClient) {
  let files: string[] = [];
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
  let relays: string[] = [];
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
  const client = new BotClient();
  client.initialize();
  const discord_token = getDiscordToken();
  client.config = config;
  
  initEvents(client);
  initCommands(client);
  //initRelays(client);

  console.log("Attempting to log in with token = " + discord_token);
  client.login(discord_token);
}

init();
