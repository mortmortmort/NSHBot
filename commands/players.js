const rp = require("request-promise");
async function player() {
  const request = {
    uri: "https://esi.evetech.net/latest/status/?datasource=tranquility",
  };
  let response = rp(request);
  let data = JSON.parse(await response);
  return data.players;
}
exports.run = async (client, message, args) => {
    const players = await player();
    message.channel.send(players + " players online currently").catch(console.error);
}