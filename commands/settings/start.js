const Commando = require("discord.js-commando");
const config = require("./../../config.js");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "start",
      aliases: ["s"],
      group: "settings",
      memberName: "start",
      description: "Start all the message filters",
      argsType: "multiple",
      userPermissions: ["MANAGE_MESSAGES"],
      format: "start",
      guildOnly: true,
    });
  }

  async run(message) {
    await message.reply(`${this.client.user.username} is starting!`);
    config.ACTIVE = true;

    this.client.user.setActivity("you", {
      type: "WATCHING",
    });
  }
};
