const Commando = require("discord.js-commando");
const config = require("./../../config.js");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["k", "kill"],
      group: "settings",
      memberName: "stop",
      description: "Stop all the message filters",
      argsType: "multiple",
      userPermissions: ["MANAGE_MESSAGES"],
      format: "stop",
      guildOnly: true,
    });
  }

  async run(message) {
    await message.reply(`${this.client.user.username} has been stopped!`);
    config.ACTIVE = false;

    this.client.user.setActivity("no one", {
      type: "WATCHING",
    });
  }
};
