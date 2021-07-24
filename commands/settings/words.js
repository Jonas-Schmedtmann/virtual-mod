const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const config = require("./../../config");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "words",
      aliases: ["word", "w"],
      group: "settings",
      memberName: "words",
      description: "Add/Remove words from the whitelist",
      argsType: "multiple",
      userPermissions: ["MANAGE_MESSAGES"],
      format: "words [add/remove] [word1 ... wordn]",
      guildOnly: true,
      throttling: { usages: 5, duration: 600 },
    });
  }

  async run(message, args) {
    const wordListFile = path.join(
      __dirname,
      "./../../misc/badWordsCustom.json"
    );
    const wordsList = JSON.parse(fs.readFileSync(wordListFile, "utf8")).words;

    if (args.length === 0) {
      if (wordsList.length !== 0) {
        const embed = new Discord.MessageEmbed()
          .setAuthor(`All words in the list:`)
          .setDescription(
            wordsList.map((word, i) => `${i + 1}) ${word}`).join("\n")
          )
          .setColor(config.SUCCESS_COLOR);

        message.channel.send(embed);
        return;
      }

      const embed = new Discord.MessageEmbed()
        .setAuthor(`The list is empty!`)
        .setColor(config.ERROR_COLOR);

      message.channel.send(embed);
      return;
    }

    const [method, ...words] = args;

    if (method.toLowerCase() === "add") {
      wordsList.push(...words);
      const newArray = [...new Set(wordsList)];

      fs.writeFile(
        wordListFile,
        JSON.stringify({ words: newArray }),
        "utf8",
        (err) => {
          if (err) console.log("ERROR: (add method, words command)", err);
        }
      );

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${newArray.length} new words added`)
        .setDescription(
          `Words Added: \n${words
            .map((word, i) => `${i + 1}) ${word}`)
            .join("\n")}`
        )
        .setColor(config.SUCCESS_COLOR);

      message.channel.send(embed);

      config.RE_READ = true;

      return;
    }

    if (method.toLowerCase() === "remove") {
      words.forEach((word) => {
        const index = wordsList.indexOf(word);
        if (index === -1) return;
        wordsList.splice(index, 1);
      });

      const newArray = [...new Set(wordsList)];

      fs.writeFile(
        wordListFile,
        JSON.stringify({ words: newArray }),
        "utf8",
        (err) => {
          if (err) console.log("ERROR: (remove method, words command)", err);
        }
      );

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${words.length} words removed`)
        .setDescription(
          `Words removed: \n${words
            .map((word, i) => `${i + 1}) ${word}`)
            .join("\n")}`
        )
        .setColor(config.SUCCESS_COLOR);

      message.channel.send(embed);

      config.RE_READ = true;
      return;
    }
  }
};
