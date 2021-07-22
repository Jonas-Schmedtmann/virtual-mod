const Discord = require("discord.js");
const validExtentions = require("./../misc/extentionsList");

module.exports = async function (message) {
  const attachmentExtentions = [];

  for (let attachment of message.attachments.values()) {
    attachmentExtentions.push(attachment.url.split(".").slice(-1).pop());
  }

  const fileExtentionsUsed = [];

  const isfileExtentionUsed = attachmentExtentions.every((extention) => {
    console.log(extention);
    const isExtentionIncluded = validExtentions.includes(extention);
    if (!isExtentionIncluded) fileExtentionsUsed.push(extention);
    return isExtentionIncluded;
  });

  if (!isfileExtentionUsed) {
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
        `:mute: **Muted ${message.author.username}**#${
          message.author.discriminator
        } *(ID: ${message.author.id})*
  :page_facing_up: **Reason:** Message attachment includes these file/s: \`${fileExtentionsUsed
    .map((ext) => `.${ext}`)
    .join(", ")}\`.
  ${
    message.content !== ""
      ? `:speech_balloon: **Message:** \`${message.content}\``
      : ""
  }`
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
  :page_facing_up: **Reason:** Message attachment includes these file/s: \`${fileExtentionsUsed
    .map((ext) => `.${ext}`)
    .join(", ")}\`. Files with this extention (\`${fileExtentionsUsed
          .map((ext) => `.${ext}`)
          .join(", ")}\`) are banned on the server.`
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

    // Delete Message
    await message.delete();
  }
};
