const Permissions = require("../permissions.js");
const DebugProcessor = require("../processors/debug.js");

module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(client.config.prefix) !== 0) return;

    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return; // message.reply("that command does not exist.");

    const perms = (cmd.getPermissions) ? cmd.getPermissions() : Permissions.defaultPermissions;
    
    Permissions.checkPermissions(client, message, command, perms)
    .then((result) => {
        if (result) {
            // Run the command
            try {
                cmd.run(client, message, args)
                .catch((ex) => {
                    client.debug.logError(
                        `Exception caught trying to execute '${command}' with args = '${args}'. 
                        Exception text = '${ex}'
                        Exception stack = '${ex.stack}'`); 
                });
            } catch (ex) {
                client.debug.logError(
                    `Exception caught trying to execute '${command}' with args = '${args}'. 
                    Exception text = '${ex}'
                    Exception stack = '${ex.stack}'`);
            };            
        } else {
            console.log("command did not meet permission requirements");
        }    
    })
  };