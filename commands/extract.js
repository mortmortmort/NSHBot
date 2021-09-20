const rp = require("request-promise");
const Discord = require("discord.js");
async function extractor() {
  const request = {
    uri:
      "https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&order_type=sell&page=1&type_id=40519"
  };
  let response = rp(request);
  let data = JSON.parse(await response);
  const aprice = data.map(data => data.price);
  const minprice = Math.min(...aprice);
  return minprice;
}
async function injector() {
    const  request= {
      uri: "https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&order_type=sell&page=1&type_id=40520",
    };
    let response = rp(request);
    let data = JSON.parse(await response);
    const aprice = data.map(data => data.price);
    const minprice = Math.min(...aprice);
    return minprice;
  }
exports.run = async (client, message, args) => {
  let amount = args.slice(0).join(" ");
  //if (amount == 0) amount = 500;
  let numberExtractor = amount/500000;
  const extractorPrice = await extractor ();
  const injectorPrice = await injector ();
  const profit = ((numberExtractor * injectorPrice) - (numberExtractor * extractorPrice));
  const embed = new Discord.MessageEmbed()
    .setColor(16389353)
    .setFooter(
      "requested by " + message.author.username,
      message.author.displayAvatarURL
    )
    .setTimestamp()
    .setThumbnail(
      "http://imageserver.eveonline.com/Type/40519_64.png"
    )
    .setAuthor("Extraction")
    .addField("Amount of extractors:", numberExtractor.toLocaleString())
    .addField(
      "Profit:",
      profit.toLocaleString()
    );
  message.channel.send({ embed });
};