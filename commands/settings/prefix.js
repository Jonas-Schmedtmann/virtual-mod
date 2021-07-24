const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      group: "settings",
      memberName: "prefix",
      description: "Display the bot's command perfix",
      argsType: "multiple",
      userPermissions: ["MANAGE_ROLES"],
      format: "prefix",
      guildOnly: true,
      throttling: { usages: 2, duration: 600 },
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
