const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "ping",
      group: "settings",
      memberName: "ping",
      description: "Display/Change the bot command perfix",
      argsType: "multiple",
      userPermissions: ["MANAGE_ROLES"],
      format: "ping",
      guildOnly: true,
    });
  }

  async run(message) {
    message.reply("pong!");
  }
};
