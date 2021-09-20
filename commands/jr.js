const Discord = require("discord.js");
const fetch = require('node-fetch');
const config = require("../config.json");



exports.run = async (client, message, args) => {

  var messageSanitized = message.content.toLowerCase();
  var command = message.content.startsWith(`${config.prefix}jr`);
  var systems = messageSanitized.replace(`${config.prefix}jr `, '');
  var sArray = systems.split(" ");
  console.log(sArray);
  let systemobj = []
if (command){
    //Get From System's System ID
    if (sArray.length === 3) {
    var fID = fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${sArray[1]}&strict=false`)
    .then((res) => {
        return res.json();
    }).then((json) => {
        return json.solar_system;
    });
    //Get To System's System ID
    var tID = fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${sArray[2]}&strict=false`)
    .then((res) => {
        return res.json();
    }).then((json) => {
        return json.solar_system;
    });
} else {
    var fID = fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${sArray[0]}&strict=false`)
    .then((res) => {
        return res.json();
    }).then((json) => {
        return json.solar_system;
    });
    //Get To System's System ID
    var tID = fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${sArray[1]}&strict=false`)
    .then((res) => {
        return res.json();
    }).then((json) => {
        return json.solar_system;
    });
}
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
    
    //Get Thera from "From" System and remove non K Space Entrances
        if (sArray.length == 2) {
          message.reply(`https://evemaps.dotlan.net/jump/Archon,544,S/${await fName}:${await tName}`)
        } else if (sArray.length === 3 && sArray[0] === 'blops'){
            message.reply(`https://evemaps.dotlan.net/jump/Panther,544,S/${await fName}:${await tName}`)
        } else if(sArray.length === 3 && sArray[0] === 'jf'){
            message.reply(`https://evemaps.dotlan.net/jump/Nomad,544,S/${await fName}:${await tName}`)
        } else {
            message.reply("I don't recognize the arguements you provided. The command is either: !jr <systemFrom> <systemTo> **OR** !jr blops <systemFrom> <systemTo> **OR** !jr jf <systemFrom> <systemTo>")
        }
    }
}



