const path = require("path");
const Commando = require("discord.js-commando");
const dotenv = require("dotenv");

const keywordChecker = require("./utils/keywordChecker");
const badWordsChecker = require("./utils/badWordsChecker");
const massMentionChecker = require("./utils/massMentionChecker");
const filesChecker = require("./utils/filesChecker");

// Configuring dotenv
dotenv.config({
  path: "./config.env",
});

const client = new Commando.Client({
  owner: "667667162579861505",
  commandPrefix: "&",
});

client.on("ready", async () => {
  console.log("===============================================");
  console.log(`Logged in as ${client.user.tag}!`);

  client.registry
    .registerGroups([["settings", "Commands related to bot settings."]])
    .registerCommandsIn(path.join(__dirname, "commands"));

  client.on("message", (message) => {
    if (message.author.bot) return;

    badWordsChecker(message);
    filesChecker(message);

    if (message.member.hasPermission("MANAGE_MESSAGES")) return;

    keywordChecker(message);
    massMentionChecker(message);
  });

  client.user.setActivity("you", {
    type: "WATCHING",
  });

  client.user.setStatus("dnd");
});

client.login(process.env.BOT_TOKEN);
