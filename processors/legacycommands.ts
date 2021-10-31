// NPM modules
import { Message, MessageEmbed } from "discord.js";

// Local modules
import { BotClient } from "../botclient";
import { DebugLevel, debugLevelFromString } from "../types/debugtypes";

const rp = require("request-promise");
const fetch = require('node-fetch');

async function getSystemIdFromSystemName(systemName: string): Promise<number> {
    let data = await fetch(`https://esi.evetech.net/latest/search/?categories=solar_system&datasource=tranquility&language=en-us&search=${systemName}&strict=false`);
    let json = await data.json();

    return json.solar_system;
}

async function getSystemNameFromId(systemId: number): Promise<string> {
    let data = await fetch(`https://esi.evetech.net/latest/universe/systems/${systemId}/?datasource=tranquility&language=en-us`);
    let json = await data.json();
    return json.name;
}

export class LegacyCommands {
    static async extract(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`LegacyCommands::extract() invoked. args = '${args}'`);

        async function extractor() {
            const request = {
                uri:
                "https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&order_type=sell&page=1&type_id=40519"
            };

            let response = await rp(request);
            let data = JSON.parse(response);            

            const aprice = data.map((val: { price: number; }) => val.price);
            const minprice = Math.min(...aprice);

            return minprice;
        }

        async function injector() {
            const request= {
                uri: "https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&order_type=sell&page=1&type_id=40520",
            };

            let response = rp(request);
            let data = JSON.parse(await response);

            const aprice = data.map((val: { price: number; })  => val.price);
            const minprice = Math.min(...aprice);

            return minprice;
        }


        let amount = (args.length > 0) ? parseInt(args.slice(0).join(" ")) : 0;

        //if (amount == 0) amount = 500;
        let numberExtractor = amount/500000;

        const extractorPrice = await extractor ();
        const injectorPrice = await injector ();

        const profit = ((numberExtractor * injectorPrice) - (numberExtractor * extractorPrice));
        const embed = new MessageEmbed()
            .setColor(16389353)
            .setFooter("requested by " + message.author.username)
            .setTimestamp()
            .setThumbnail("http://imageserver.eveonline.com/Type/40519_64.png")
            .setAuthor("Extraction")
            .addField("Amount of extractors:", numberExtractor.toLocaleString())
            .addField(
            "Profit:",
            profit.toLocaleString()
        );
        message.channel.send({ embeds: [ embed ] });
    }

    static async jr(client: BotClient, message: Message, args: string[]): Promise<void> {
        client.debug.logTrace(`LegacyCommands::jr() invoked. args = '${args}'`);

        let sArray = args;

        let fID;
        let tID;

        //Get From System's System ID
        if (sArray.length === 3) {
            fID = await getSystemIdFromSystemName(sArray[1]);
            tID = await getSystemIdFromSystemName(sArray[2]);
        } else {
            fID = await getSystemIdFromSystemName(sArray[0]);
            tID = await getSystemIdFromSystemName(sArray[1]);
        }

        //Get From System's System Name 
        let fName = await getSystemNameFromId(fID);

        //Get To System's System Name
        let tName = await getSystemNameFromId(tID);

        //Get Shortest Jump Route via Gates 
        
        //Get Thera from "From" System and remove non K Space Entrances
        if (sArray.length == 2) {
            message.reply(`https://evemaps.dotlan.net/jump/Archon,544,S/${fName}:${tName}`)
        } else if (sArray.length === 3 && sArray[0] === 'blops'){
            message.reply(`https://evemaps.dotlan.net/jump/Panther,544,S/${fName}:${tName}`)
        } else if(sArray.length === 3 && sArray[0] === 'jf'){
            message.reply(`https://evemaps.dotlan.net/jump/Nomad,544,S/${fName}:${tName}`)
        } else {
            message.reply("I don't recognize the arguements you provided. The command is either: !jr <systemFrom> <systemTo> **OR** !jr blops <systemFrom> <systemTo> **OR** !jr jf <systemFrom> <systemTo>")
        }
    }

    static async players(client: BotClient, message: Message, args: string[]): Promise<void> {
        const request = {
            uri: "https://esi.evetech.net/latest/status/?datasource=tranquility",
        };

        let response = await rp(request);
        let data = JSON.parse(response);

        message.channel.send(data.players + " players online currently").catch(console.error);
    }
};