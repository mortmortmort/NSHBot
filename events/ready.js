module.exports = async client => {
    // Make the bot "play the game" which is the help command with default prefix.
    client.user.setActivity("with your mom", {type: "PLAYING"});
    console.log("I am ready!");
  };