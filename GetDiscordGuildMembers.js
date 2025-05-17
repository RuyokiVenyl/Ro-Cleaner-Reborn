const { Client } = require("discord.js-selfbot-v13");
const axios = require("axios");
const fs = require('fs');
const Discord = require("discord.js-selfbot-v13");
const client = new Client({
  checkUpdate: false,
});
const config = require("./config.js");
const db = require("old-wio.db");
db.backup("backup.json");
var moment = require("moment");
moment.suppressDeprecationWarnings = true;
const express = require("express");
const app = express();
app.get("/", function (req, res) {
  res.send("Why are you here?");
});
app.listen(3000);
client.on("ready", async () => {
  console.log(`${client.user.tag} is working, lets go!`);
  client.user.setStatus(config.presence.status);
  const r = new Discord.CustomStatus()
    .setState(config.presence.customStatus)
    .setEmoji(config.presence.emoji);
  client.user.setActivity(r.toJSON());
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
client.once('ready', async () => {
  const guild = client.guilds.cache.get(config.serverID);
  console.log(client.sessionId)
  if (!guild) {
    console.log('Invalid guild!');
    return;
  }
  try {
    let totalMembers = 0;
    let fetchedMembers = 0;
    let lastFetchedId = null;
    const allMemberIds = [];
    async function fetchMembers() {
      let attempts = 0;
      const maxAttempts = 5;
      const batchSize = 100;
      while (fetchedMembers < guild.memberCount && attempts < maxAttempts) {
        try {
          const members = await guild.members.fetch({
            limit: batchSize,
            after: lastFetchedId,
            timeout: 60000,
          });
          fetchedMembers += members.size;
          totalMembers += members.size;
          if (fetchedMembers > 0) {
            lastFetchedId = members.last().id;
            console.log(`Fetched ${members.size} members in this batch. Total fetched so far: ${fetchedMembers}`);
          }
          members.forEach(member => {
            allMemberIds.push(member.user.id);
          });
          await delay(1000);
        } catch (error) {
          attempts++;
          console.error(`Error fetching members (Attempt ${attempts}/${maxAttempts}):`, error);
          if (attempts < maxAttempts) {
            console.log('Retrying...');
            await delay(5000);
          } else {
            console.error('Max retry attempts reached. Unable to fetch members.');
            break;
          }
        }
      }
      console.log(`Total members fetched: ${fetchedMembers}`);
      console.log(`Total members in server: ${guild.memberCount}`);
    }
    await fetchMembers();
    if (fetchedMembers < guild.memberCount) {
      console.log(`Warning: Fetched members (${fetchedMembers}) is less than guild member count (${guild.memberCount})`);
    }
    const memberIds = allMemberIds.join('\n');//guild.members.cache.map(member => member.user.id).join('\n');
    fs.writeFileSync('member_ids.txt', memberIds);
    console.log(`Members user IDs saved to member_ids.txt`);
  } catch (error) {
    console.error('Error fetching members:', error);
  }
});
client.login(config.token);