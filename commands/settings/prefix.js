const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      group: "settings",
      memberName: "prefix",
      description: "Display/Change the bot command perfix",
      argsType: "multiple",
      userPermissions: ["MANAGE_ROLES"],
      format: "prefix",
      guildOnly: true,
    });
  }

  async run(message) {
    const { client } = this;
    const prefix = client.commandPrefix;

    message.reply(
      `The command prefix is \`${prefix}\`. \n To run commands, use \`${prefix}command\` or \`${client.user.tag} command\`.`
    );
  }
};
