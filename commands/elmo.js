const rp = require("request-promise");
const Discord = require("discord.js");
const countdown = require('moment-countdown');
const moment = require('moment');
var tracker = require('delivery-tracker')
var courier = tracker.courier(tracker.COURIER.USPS.CODE)




exports.run = async (client, message) => {
    courier.trace('EH021721431US', function (err, result) {

        if(err){
            console.log(err)
        } else {
                    //message.reply(`\n\n**ELMO'S PACKAGE STATUS**\n**Status**: InTransit\n**Location**: KABUL, AFGHANISTAN\n**Message**: Package has been side loaded to a Camel and is in route to it's destination!`)
         message.reply(`\n\n**ELMO'S PACKAGE STATUS**\n**Status**: ${result.status}\n**Location**: ${result.checkpoints[0].location}\n**Message**: ${result.checkpoints[0].message}`)

        }

      })
   // message.reply();
}