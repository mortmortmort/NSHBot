const Discord = require("discord.js");
const client = new Discord.Client();
const countdown = require('moment-countdown');
var moment = require('moment');
const superagent = require('superagent');
require('dotenv').config()
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

exports.run = async (client, message) => {
  var messageSanitized = message.content.toLowerCase();
  const aAdmin = await message.guild.roles.fetch(process.env.ALLIANCE_ADMIN_ID);
  if (message.member.roles.cache.has(aAdmin.id)) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query("SELECT * FROM users", function(err, rows) {
        connection.release();
        if (err) throw err;
        var income = [];
        function sumArr(total, num) {
          return total + num;
        }
        rows.forEach((row, index) => {
          var bounties = [];
          superagent.get(`https://${process.env.EVE_ESI_URL}/latest/characters/${row.char_id}/?datasource=tranquility`).end((err, response) => {
            superagent
              .get(`https://${process.env.EVE_ESI_URL}/latest/corporations/${response.body.corporation_id}/wallets/1/journal/?datasource=tranquility`)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Host', process.env.EVE_ESI_URL)
              .set('authorization', `Bearer ${row.access_token}`)
              .end(function(err, res) {
                if (err) {
                  console.log(err);
                } else {
                  var trans = res.body;
                  trans.forEach((t, ind) => {
                    var a = moment(); //now
                    var b = moment(t.date);
                    var daydiff = a.diff(b, 'days');
                    if (t.ref_type === "bounty_prizes" || t.ref_type === "ess_escrow_transfer" || t.ref_type === "corporate_reward_payout" || t.ref_type === "agent_mission_reward") {
                      bounties.push(t.amount);
                    }
                    if (ind === trans.length - 1) {
                    superagent.get(`https://${process.env.EVE_ESI_URL}/latest/corporations/${response.body.corporation_id}/?datasource=tranquility`).end((err, corp) => {
                      var thirtyInc = bounties.reduce(sumArr,0)
                      income.push({
                        "corp_name": corp.body.name,
                        "corp_director": row.char_name,
                        "thirty_day_income": thirtyInc,
                        "corp_tax": Math.round(corp.body.tax_rate * 100),
                        "tax": thirtyInc * .5
                      })
                    
                      if (income.length === rows.length) {
                        const embed = new Discord.MessageEmbed()
                          .setFooter(`NSH Ratting Tax Calculator`)
                          .setDescription(`Work in Progress`)
                          .setColor('cc00cc')
                          .setTitle('NSH Ratting Tax');
                        income.forEach((corps, index) => {
                          var incRound = Math.round(corps.thirty_day_income);
                          var taxRound = Math.round(corps.tax);
                          var specRound = Math.round(corps.thirty_day_income * .3846);
                          if (corps.corp_tax === 5) {
                            var taxOwed = incRound.toLocaleString();
                          } else if (corps.corp_tax === 10) {
                            var taxOwed = taxRound.toLocaleString();
                          } else if (corps.corp_tax === 13) {
                            var taxOwed = specRound.toLocaleString();
                          }
                          embed.addField(`Corp:\n${corps.corp_name} (${corps.corp_tax}% TAX)`, `**30 Day Income**: \n${incRound.toLocaleString()} ISK \n **ISK DUE**: \n${taxOwed} ISK`, true);
                          if (index === income.length - 1) {
                            console.log(`end of income loop`)
                            var totalIncome = 0
                            income.forEach((i,dex) => {
                              totalIncome = totalIncome + i.tax;
                              if (dex === income.length - 1) {
                                 embed.setFooter(`Total 30 Day Alliance Income: ${Math.round(totalIncome).toLocaleString()} ISK `)
                                message.reply(embed);
                              }
                            })
                          }
                        })
                      }
                    })
                    }
                  })
                }
              })
          })
        })
      });
    });

  }

}