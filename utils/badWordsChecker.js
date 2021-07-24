const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const config = require("./../config");
const keywords = require("./../misc/badWordsList");

const wordListFile = path.join(__dirname, "./../misc/badWordsCustom.json");

let wordsList = JSON.parse(fs.readFileSync(wordListFile, "utf8")).words;

module.exports = async function (message) {
  if (config.RE_READ) {
    wordsList = JSON.parse(fs.readFileSync(wordListFile, "utf8")).words;
    config.RE_READ = false;
  }

  let keywordsUsed = null;

  const isKeywordUsed = keywords.some((word) => {
    const isWordIncluded =
      message.content.toLowerCase().split(" ").includes(word) &&
      !wordsList.includes(word);
    if (isWordIncluded) keywordsUsed = word;
    return isWordIncluded;
  });

  if (isKeywordUsed) {
    // Mute the person
    const mutedRole = message.member.guild.roles.cache.find(
      (role) => role.id === process.env.MUTED_ROLE_ID
    );

    await message.member.roles.add(mutedRole);

    // Add to logs
    const LogEmbed = new Discord.MessageEmbed()
      .setAuthor(
        `${message.client.user.tag} (ID: ${message.client.user.id})`,
        message.client.user.avatarURL()
      )
      .setDescription(
        `:mute: **Muted ${message.author.username}**#${message.author.discriminator} *(ID: ${message.author.id})*
:page_facing_up: **Reason:** Message includes \`${keywordsUsed}\`
:speech_balloon: **Message:** \`${message.content}\``
      )
      .setThumbnail(message.author.avatarURL())
      .setFooter(`Duration: 10 minutes`)
      .setColor(mutedRole.hexColor);

    await message.client.channels.cache
      .get(process.env.LOGS_CHANNEL_ID)
      .send(LogEmbed);

    // Send Message in DMs
    const DMMuteEmbed = new Discord.MessageEmbed()
      .setAuthor(
        `${message.client.user.tag} (ID: ${message.client.user.id})`,
        message.client.user.avatarURL()
      )
      .setDescription(
        `:file_cabinet: **Server:** ${message.guild.name}
:mute: You have been muted. (Duration: 10 minutes).
:page_facing_up: **Reason:** The word \`${keywordsUsed}\` is banned, watch your language.`
      )
      .setColor(mutedRole.hexColor);
    await message.author.send(DMMuteEmbed);

    setTimeout(async () => {
      await message.member.roles.remove(mutedRole);

      //Logs
      const LogEmbed = new Discord.MessageEmbed()
        .setAuthor(
          `${message.client.user.tag} (ID: ${message.client.user.id})`,
          message.client.user.avatarURL()
        )
        .setDescription(
          `:loud_sound: **Unmuted ${message.author.username}**#${message.author.discriminator} *(ID: ${message.author.id})*`
        )
        .setThumbnail(message.author.avatarURL())
        .setColor("#43b581");

      await message.client.channels.cache
        .get(process.env.LOGS_CHANNEL_ID)
        .send(LogEmbed);
      // DM
      const DMUnMuteEmbed = new Discord.MessageEmbed()
        .setAuthor(
          `${message.client.user.tag} (ID: ${message.client.user.id})`,
          message.client.user.avatarURL()
        )
        .setDescription(
          `:file_cabinet: **Server:** ${message.guild.name}
:loud_sound: Mute Duration Expired. You have been unmuted.`
        )
        .setColor("#43b581");
      await message.author.send(DMUnMuteEmbed);
    }, 600000); // 10 Mins
    // }, 10000); // 10 Mins

    // Delete Message
    await message.delete();
  }
};
