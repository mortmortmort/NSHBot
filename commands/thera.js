const Discord = require("discord.js");
const fetch = require('node-fetch');
const config = require("../config.json");



exports.run = async (client, message, args) => {

  var messageSanitized = message.content.toLowerCase();
  var command = message.content.startsWith(`${config.prefix}thera`);
  if (command){
    let thera = fetch(`https://www.eve-scout.com/api/wormholes`)
        .then(res2 => res2.json())
        .then(json2 => { 
          var theraSort = json2.sort((a,b)=> (a.jumps > b.jumps ? 1 : -1));
          theraSort = theraSort.filter(item => item.jumps !== 0);
          var toEnt = [];
          theraSort.forEach((wh) => {
              if (wh.destinationSolarSystem.security != -0.99){
              toEnt.push(`\nSystem: ${wh.destinationSolarSystem.name} (${wh.destinationSolarSystem.region.name})`)
        }
        });
          return toEnt;
        });    
        theraHoles = await thera;
        message.reply(theraHoles.join(""))
    }
}



