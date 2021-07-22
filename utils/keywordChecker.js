const Discord = require("discord.js");
const keywords = require("./../misc/keywordsList");

module.exports = async function (message) {
  let keywordsUsed = null;

  const isKeywordUsed = keywords.some((word) => {
    const isWordIncluded = message.content.toLowerCase().includes(word);
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
      .setFooter(`Duration: permanent`)
      .setColor(mutedRole.hexColor);

    await message.client.channels.cache
      .get(process.env.LOGS_CHANNEL_ID)
      .send(`<@&${process.env.MOD_TEAM_ROLE_ID}>,`, LogEmbed);

    // Send Message in DMs
    const DMEmbed = new Discord.MessageEmbed()
      .setAuthor(
        `${message.client.user.tag} (ID: ${message.client.user.id})`,
        message.client.user.avatarURL()
      )
      .setDescription(
        `:file_cabinet: **Server:** ${message.guild.name}
:mute: You have been muted :mute:.
:page_facing_up: **Reason:** Message includes \`${keywordsUsed}\``
      )
      .setThumbnail(message.author.avatarURL())
      .setColor(mutedRole.hexColor);
    await message.author.send(DMEmbed);

    // Delete Message
    await message.delete();
  }
};
