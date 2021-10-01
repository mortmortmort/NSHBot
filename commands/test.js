const Discord = require("discord.js");
const Permissions = require("../permissions.js");
const TextToImage = require('text-to-image');
const TextToPicture = require('text-to-picture');
const Crypto = require("crypto");
const FSP = require("fs").promises;

const PngValidator = require('png-validator');


const DATA_PATH = "./pings/";

exports.getPermissions = (client, message, args) => {
    return { User: Permissions.UserPermissions.Public, Channel: Permissions.ChannelPermissions.All };
};

exports.run = async (client, message, args) => { 
    // using await
    const text = args.join(' ');

    const id = Crypto.randomBytes(16).toString("hex");
    const fileName = id + ".png";
    const path = DATA_PATH + fileName;

    const result = await TextToPicture.convert({
        text: text,
        size: 16,
        color: 'white'
    });
    const dataUri = await result.getBase64();
    await result.write(path);


    /*await FSP.writeFile(path, dataUri, 'base64');

    const buffer = await FSP.readFile(path, 'base64');

    try {
        PngValidator.pngValidator(buffer);
        console.log("Valid!");
    } catch (ex) {
        console.log(buffer);
        console.log(ex);
    }    
    return;
*/
    
    const attachment = new Discord.MessageAttachment(path, fileName);
    const embed = new Discord.MessageEmbed()
        .setTitle('NSH Ping')
        .attachFiles(attachment)
        .setImage("attachment://" + fileName);

    const messageObj = {
        embed: {
            title: "The Image",
            files: [
                attachment
            ],
            image: {
                url: 'attachment://' + fileName
            }
        }
        }

    //await message.channel.send({embed});

    const msg = await message.channel.send({ files: [attachment] })
    const url = msg.attachments.first()?.url ?? '';

    console.log(url);
}
