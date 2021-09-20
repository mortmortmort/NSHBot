const Discord = require("discord.js");
const fetch = require('node-fetch');
const config = require("../config.json");



exports.run = async (client, message, args) => {
    var messageSanitized = message.content.toLowerCase();
    var toon = messageSanitized.replace(`${config.prefix}who `, '');
    const evewho = "https://evewho.com/pilot/";
    const zkill = "https://zkillboard.com/character/";
    const zkillStatsCharacter = "https://zkillboard.com/api/stats/characterID/";
    const zkillLosses = "https://zkillboard.com/api/characterID/";
    if (toon === '!who') {
        message.reply('Cannot submit an empty request');
        return;
    }
    //Get Character ID
    let charID = fetch(`https://esi.evetech.net/latest/search/?categories=character&datasource=tranquility&language=en-us&search=${toon}&strict=true`)
        .then((res) => {
            return res.json();
        }).then((json) => {
            return json.character;
        });
    //Get Character Information
    let charInfo = fetch(`https://esi.evetech.net/latest/characters/${await charID}/?datasource=tranquility`)
        .then((res) => {
            return res.json();
        }).then((json) => {
            return json;
        });
    charInfo = await charInfo;
    //Get Character Corporation Information 
    let corpInfo = fetch(`https://esi.evetech.net/latest/corporations/${charInfo.corporation_id}/?datasource=tranquility`)
        .then((res) => {
            return res.json();
        }).then((json) => {
            return json.name;
        });
    //Get Character Alliance Information
    let allianceInfo = fetch(`https://esi.evetech.net/latest/alliances/${charInfo.alliance_id}/?datasource=tranquility`)
        .then((res) => {
            return res.json();
        }).then((json) => {
            return json.name;
        });
    if (typeof charInfo.alliance_id !== 'undefined') {
        var allianceAffil = await allianceInfo;
    } else {
        var allianceAffil = 'None';
    }
    //Get Zkill Information - Gets really buggy if you aren't a good boy and include headers in the request
    let zkillStats = fetch(`${zkillStatsCharacter}${await charID}/`, {
        headers: {
            'User-Agent': 'NSHDiscordBot'
        }
    })
        .then(res2 => res2.json())
        .then(async stats => {
            let embed = new Discord.MessageEmbed()
                .setThumbnail(`https://images.evetech.net/characters/${await charID}/portrait?size=128`)
                .setColor("#f45042")
                .setTitle("Results for: " + charInfo.name)
                .addField("Corporation: ", await corpInfo, true);
            if (allianceAffil !== 'None') {
                embed.addField('Alliance: ', allianceAffil, true);
            }
            embed.addField("EveWho: ", evewho + encodeURI(toon))
            embed.addField("Zkill: ", `${zkill}${await charID}/`)
            //embed.setFooter("Note: Toons with no kill/loss history will not have a valid zkill link.");
            function getMatch(a, b) {
                var matches = [];
                for (var i = 0; i < a.length; i++) {
                    for (var e = 0; e < b.length; e++) {
                        if (a[i] === b[e]) matches.push(a[i]);
                    }
                }
                return matches;
            }
            if (stats.topAllTime !== 'null' && stats.topAllTime && stats.topAllTime[4].data.length !== 0) {
                let body = stats;
                let shipIDs = [];
                let ShipNames = [];
                var sArray = ["Hel", "Aeon", "Wyvern", "Nyx", "Vendetta", "Revenant", "Avatar", "Erebus", "Leviathan", "Ragnarok", "Molok", "Vanquisher", "Komodo"]
                var cArray = ["Apostle", "Lif", "Ninazu", "Minokawa", "Chimera", "Archon", "Thanatos", "Nidhoggur", "Moros", "Phoenix", "Naglfar", "Revelation", "Vehement"]
                var topShips = body.topAllTime[4].data;
                topShips.forEach((ship) => {
                    shipIDs.push(ship.shipTypeID);
                });
                let shipNames = [];
                /*Promise to return Top Ships, Caps, and Supers Flown!!
                Will refactor further to streamline and improve the process
                in the future.
                */
                var shipPromise = new Promise((resolve, reject) => {
                    shipIDs.forEach(shipID => {
                        let shipFetch = fetch(`https://esi.evetech.net/latest/universe/types/${shipID}/?datasource=tranquility&language=en-us`)
                            .then((res) => {
                                return res.json();
                            }).then((ship) => {
                                shipNames.push(ship.name);
                                if (shipNames.length === shipIDs.length) {
                                    resolve();
                                }
                                //return ship.name;
                            });
                    })
                });
                shipPromise.then(() => {
                    var sMatch = getMatch(sArray, shipNames);
                    var cMatch = getMatch(cArray, shipNames);
                    if (shipNames.length != 0) {
                        var topThree = shipNames;
                        topThree.length = 3;
                        embed.addField('*Ships*: ', topThree, true);
                    }
                    if (cMatch.length > 0) {
                        embed.addField('*Caps Flown*: ', cMatch, true);
                    }
                    if (sMatch.length > 0) {
                        embed.addField('*Supers Flown*: ', sMatch, true);
                    }

                    message.channel.send(embed);
                });

            } else {
                message.channel.send(embed)
            }
        });
}



