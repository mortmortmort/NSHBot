const Discord = require("discord.js");
const fetch = require('node-fetch');
const config = require("../config.json");



exports.run = async (client, message, args) => {

  var messageSanitized = message.content.toLowerCase();
  var command = message.content.startsWith(`${config.prefix}route`);
  var systems = messageSanitized.replace(`${config.prefix}route `, '');
  var sArray = systems.split(" ");
  console.log(sArray);
  fParams = {"categories": "solar_system","datasource": config.datasource, "ifNoneMatch": config.ifNoneMatch, "search": sArray[0], "strict": false}
  tParams = {"categories": "solar_system","datasource": config.datasource, "ifNoneMatch": config.ifNoneMatch, "search": sArray[1], "strict": false}
  let systemobj = []

    //Get From System's System ID
    let fID = fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${sArray[0]}&strict=false`)
    .then((res) => {
      
        return res.json();
    }).then((json) => {
      console.log(json)
        if (json.solar_system.length >= 2){
          message.reply(`Command returned more than one From system similar to ${sArray[0]}. Try using a system in close proximity to this with a more unique name.`)
          return;
        } else {
          return json.solar_system;
        }
       
    });
    //Get To System's System ID
    let tID = fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${sArray[1]}&strict=false`)
    .then((res) => {
        return res.json();
    }).then((json) => {
      if (json.solar_system.length >= 2){
        message.reply(`Command returned more than one To system similar to ${sArray[1]}. Try using a system in close proximity to this with a more unique name.`)
        return;
      } else {
        return json.solar_system;
      }
    });
    //Get From System's System Name 
    let fName = fetch(`https://esi.evetech.net/latest/universe/systems/${await fID}/?datasource=tranquility&language=en-us`)
    .then((res) => {
        return res.json();
    }).then((json) => {
      //console.log(json)
        return json.name;
    });
    //Get To System's System Name
    let tName = fetch(`https://esi.evetech.net/latest/universe/systems/${await tID}/?datasource=tranquility&language=en-us`)
    .then((res) => {
        return res.json();
    }).then((json) => {
        return json.name;
    });
    //Get Shortest Jump Route via Gates 
    let gateRoute = fetch(`https://esi.evetech.net/latest/route/${await fID}/${await tID}/?datasource=tranquility&flag=shortest`)
    .then((res) => {
        return res.json();
    }).then((json) => {
        return json.length - 1;
    });
    //Get Thera from "From" System and remove non K Space Entrances
    let fThera = fetch(`https://www.eve-scout.com/api/wormholes?systemSearch=${await fName}&order=desc`)
        .then(res2 => res2.json())
        .then(json2 => { 
          console.log(json2)
          var theraSort = json2.sort((a,b)=> (a.jumps > b.jumps ? 1 : -1));
          theraSort = theraSort.filter(item => item.jumps !== 0);
          fromEnt = {
            name: theraSort[0].destinationSolarSystem.name,
            region: theraSort[0].destinationSolarSystem.region.name,
            jumps: theraSort[0].jumps
          }
          return fromEnt;
        });
    //Get Thera from "To" System and remove non K Space Entrances
    let tThera = fetch(`https://www.eve-scout.com/api/wormholes?systemSearch=${await tName}&order=desc`)
        .then(res2 => res2.json())
        .then(json2 => { 
          var theraSort = json2.sort((a,b)=> (a.jumps > b.jumps ? 1 : -1));
          theraSort = theraSort.filter(item => item.jumps !== 0);
          toEnt = {
            name: theraSort[0].destinationSolarSystem.name,
            region: theraSort[0].destinationSolarSystem.region.name,
            jumps: theraSort[0].jumps
          }
          return toEnt;
        });
        let fromSystem = await fThera;
        let toSystem = await tThera;
        if (await gateRoute <= fromSystem.jumps + toSystem.jumps) {
          message.reply(`The shortest route from ${await fName} to ${await tName} is ${await gateRoute} Gate Jumps.`)
        } else if (fromSystem.jumps + toSystem.jumps < await gateRoute){
          message.reply(`The shortest route from ${await fName} to ${await tName} is through Thera. \n${await fName} -> ${fromSystem.name} (${fromSystem.jumps} Jumps)\n${toSystem.name} -> ${await tName} (${toSystem.jumps} Jumps)\n **TOTAL**: ${fromSystem.jumps + toSystem.jumps} Jumps \n*Jumps without Thera*: ${await gateRoute}`)
        }
}



