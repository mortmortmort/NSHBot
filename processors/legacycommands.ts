// NPM modules
import { Message, MessageEmbed } from "discord.js";

// Local modules
import { BotClient } from "../botclient";
import { DebugLevel, debugLevelFromString } from "../types/debugtypes";

const rp = require("request-promise");

export class LegacyCommands {
    static async extract(client: BotClient, message: Message, args: string[]): Promise<void> {

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
};