// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { Permissions } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const StormDB = require("stormdb");
require('dotenv').config()
const token = process.env.token
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientId = process.env.clientId
/* const dblToken = process.env.DBLTOKEN
const AutoPoster = require('topgg-autoposter')

const ap = AutoPoster(dblToken, bot)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
  const statslogchannel = bot.channels.cache.find(channel => channel.id === "809921395370360832")
  statslogchannel.send('Posted stats to Top.gg! = https://top.gg/bot/799067793357537290')
})
 */

//db.default({});
//console.log("Database Resetted")


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("guildCreate", guild => {
    const errorlogchannel = client.channels.cache.find(channel => channel.id === "931557255449550909")
	const embed = new MessageEmbed()
		.setColor("#30C68D")
		.setTitle(`Joined New Guild = \`\`\`${guild.name}\`\`\``)
		.addField(`Number of Members:`,`${guild.memberCount}`, false)
		.setTimestamp()
    .setFooter('SlashBot');
  errorlogchannel.send({ embeds: [embed] });
})

client.once("guildDelete", guild => {
  const errorlogchannel = client.channels.cache.find(channel => channel.id === "931557255449550909")
  const embed = new MessageEmbed()
	.setColor("#30C68D")
	.setTitle("Left Guild")
	.addField(`Total number of servers:`, `${client.guilds.cache.size}`, false)
	.setTimestamp()
  .setFooter('SlashBot');
errorlogchannel.send({ embeds: [embed] });
})


client.once("error", (e) => console.error(e));
client.once("warn", (e) => console.warn(e));
client.once("debug", (e) => console.info(e));

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
	const errorlogchannel = client.channels.cache.find(channel => channel.id === "931557255449550909")
	errorlogchannel.send('CC-bot has restarted...')

  var serverArr = db.get().state

  for (const server in serverArr) {
    commands = []
    let guildcmdArr = db.get().state[server]

    guildcmdArr.forEach(element => {
      commands.push(new SlashCommandBuilder().setName(element.command).setDescription('Custom Command'),)
    });

    commands.map(command => {
     command.toJSON()
    })
    
    const rest = new REST({ version: '9' }).setToken(token);
    
    rest.put(Routes.applicationGuildCommands(clientId, server), { body: commands })
      .then(() => console.log('Successfully registered commands for server'))
      .catch(console.error); 

}});
  



client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

  var guildCMDs = db.get().state[`${interaction.guild.id}`]
    if (commandName !== "add" && commandName !== "delete" && commandName !== "setup" && commandName !== "list" && commandName !== "help" && commandName !== "ping") {
      if (guildCMDs.filter(word => word.command.includes(commandName))) {
        outputIndex = guildCMDs.findIndex(x => x.command === commandName)
        if (!guildCMDs[outputIndex].output) {
          return
        } else if (guildCMDs[outputIndex].output) {
        await interaction.reply(guildCMDs[outputIndex].output)
        console.log("Custom Command detected")
        }
      } else {return}
    }


  if (commandName === "help") {
    const embed = new MessageEmbed()
      .setTitle("Command List:")
      .setAuthor("SlashBot - the Custom Command Creator", "","")
      .setColor("#2AA198")
      .addFields(
          { name: '`/setup`', value: 'Setup the bot for the first time in your server'    },
          { name: '`/list`', value: 'List your custom commands'    },
          { name: '`/add`', value: 'Add a custom command'    },
          { name: '`/delete`', value: 'Delete a custom command'    },
          { name: '`/ping`', value: 'Check the bot latency'    },
          { name: '`/help`', value: 'Get this help message'    },

          { name: '__**THE NEXUS**__', value: '[Invite Me!](https://discord.com/oauth2/authorize?client_id=799067793357537290&permissions=268692534&scope=bot)\n[Vote for Me!](https://top.gg/bot/799067793357537290)\n[Support Server](https://discord.com/invite/RzUyKwZ83b)'},
      )
      .setFooter('Made By PerryPal')
      .setTimestamp()
      .setThumbnail("https://i.imgur.com/saKVaf9.jpg")

    await interaction.reply({ embeds: [embed] })
  }


	if (commandName === 'ping') {
    const debug = interaction.options.getString('debug');
    if (debug) {
      if (interaction.user.id === "448961522668929025") {
        await interaction.reply("Hi, Perry")
      } else {
        const embed = new MessageEmbed()
        .setColor("#9B59B6")
        .setTitle(`🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms`)
        .setTimestamp()
        .setFooter('SlashBot');
        await interaction.reply({ embeds: [embed] })
        const errorlogchannel = client.channels.cache.find(channel => channel.id === "931557255449550909")
        errorlogchannel.send('Incorrect attempt to use debugging menu in ' + interaction.guild.name)
      }
    } else {
      const embed = new MessageEmbed()
      .setColor("#9B59B6")
      .setTitle(`🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms`)
      .setTimestamp()
      .setFooter('SlashBot');
      await interaction.reply({ embeds: [embed] })
    }
    
  }
  
  if (commandName === 'list') {
    const data = db.get().state
    var triggerArr = []
    var triggerStr;
    const ccArr = data[`${interaction.guild.id}`]
    
    console.log(ccArr)
    if (ccArr) {
      console.log("Exists")
      for (var i = 0; i < ccArr.length; i++) { 
        console.log(data[`${interaction.guild.id}`][i].command)
        triggerArr.push(`\`/${data[`${interaction.guild.id}`][i].command}\``)
        
      }
      triggerStr = triggerArr.join("\n")
      console.log(triggerArr)
      if (triggerArr.length === 0) {
        const embed = new MessageEmbed()
        .setColor("#F1C40F")
        .setTitle("List of Custom Commands:")
        .setDescription("Seems like there is nothing here. Use `/add` to add a custom command")
        .setTimestamp()
        .setFooter('SlashBot');
        await interaction.reply({ embeds: [embed] })
      } else if (triggerArr.length !== 0) {
        const embed = new MessageEmbed()
        .setColor("#F1C40F")
        .setTitle("List of Custom Commands")
        .setDescription(`${triggerStr}`)
        .setTimestamp()
        .setFooter('SlashBot');
        await interaction.reply({ embeds: [embed] })
      }

    }
    if (!ccArr) {
      const embed = new MessageEmbed()
      .setColor("#F1C40F")
      .setTitle("The Database Entry Does Not Exist")
      .setDescription("Use `/setup` to get started")
      .setTimestamp()
      .setFooter('SlashBot');
      await interaction.reply({ embeds: [embed] })
    }

    
  }

  if (commandName === 'setup') {
    const data = db.get().state
    const ccArr = data[`${interaction.guild.id}`]
    
    console.log(data[`${interaction.guild.id}`])
    if (ccArr) {
      const embed = new MessageEmbed()
      .setColor("#ECF0F1")
      .setTitle("Database Entry Already Exists")
      .setDescription("The database entry for this server already exists.\n\nUse `/list` to see the custom commands that have been added.")
      .setTimestamp()
      .setFooter('SlashBot');
      await interaction.reply({ embeds: [embed] })
    }
    if (!ccArr) {
      var id = interaction.guild.id
      db.set(id, [])
      db.save()
      const embed = new MessageEmbed()
      .setColor("#ECF0F1")
      .setTitle("Database Entry Has Been Created")
      .setDescription("A Database entry has been created for this server. Use `/add` to add a new custom command")
      .setTimestamp()
      .setFooter('SlashBot');
      await interaction.reply({ embeds: [embed] })
    }

    
  }
  
  if (commandName === 'add') {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
    const commandAdd = interaction.options.getString('command');
    const outputAdd = interaction.options.getString('output');
    console.log(commandAdd, outputAdd)
    var cmdguild = interaction.guild.id
    var initialcmdArr = db.get().state[`${interaction.guild.id}`]

    function getByValue(arr, value) {
      for (var i=0, iLen=arr.length; i<iLen; i++) {
        if (arr[i].command == value) return arr[i];
      }
    }

    matchedObj = getByValue(initialcmdArr,commandAdd)

    if (!commandAdd || !outputAdd ) {
    const embed = new MessageEmbed()
      .setColor("#E74C3C")
		  .setTitle("\:x: Seems like something went wrong...")
		  .setDescription("ERROR - Please enter the required parameters\n\n**Command Usage:**\n\`/add command:test output:test\`")
      .setFooter('SlashBot');
      await interaction.reply({ embeds: [embed] })
    } else if (commandAdd && outputAdd) {
      if (commandAdd.includes(" ")) {
        const embed = new MessageEmbed()
        .setColor("#E74C3C")
        .setTitle("\:x: Seems like something went wrong...")
        .setDescription("ERROR - The command cannot contain a space\n\n**Command Usage:**\n\`/add command:test output:test\`")
        .setFooter('SlashBot');
        await interaction.reply({ embeds: [embed] })
      } else if (!matchedObj) {
        var cmdArr = db.get().state[`${interaction.guild.id}`]
        var commands = []
        console.log(cmdArr.length)
    
      for (var i = 0; i < cmdArr.length; i++) {
        commands.push(new SlashCommandBuilder().setName(cmdArr[i].command).setDescription('Custom Command'),)
        console.log(cmdArr[i].command)
      }

      commands.push(new SlashCommandBuilder().setName(commandAdd).setDescription('Custom Command'))
      console.log(commands)
      commands.map(command => command.toJSON());
  
      const rest = new REST({ version: '9' }).setToken(token);
  
      rest.put(Routes.applicationGuildCommands(clientId, cmdguild), { body: commands })
        .then(() => console.log('Successfully registered commands for server'))
        .catch(console.error);  

      console.log(db.get().state[`${interaction.guild.id}`])
      db.get(interaction.guild.id).push({command:commandAdd, output: outputAdd})
      db.save()


      const embed = new MessageEmbed()
      .setColor("#2ECC71")
		  .setTitle(`\`/${commandAdd}\` has been created`)
      .addFields(
        { name: 'Output', value: `${outputAdd}` }
      )
		  .setDescription('It can take up to 5 seconds for the command to be available for use')
      .setFooter('SlashBot')
      .setTimestamp()
      await interaction.reply({ embeds: [embed] })


  } else if (matchedObj) {
    const embed = new MessageEmbed()
    .setColor("#E74C3C")
    .setTitle("\:x: Seems like something went wrong...")
    .setDescription(`\`/${commandAdd}\` already exists.\n\nUse \`/list\` to check your custom command list.`)
    .setTimestamp()
    .setFooter('SlashBot');
    await interaction.reply({ embeds: [embed] })
  }}} else {
    const embed = new MessageEmbed()
    .setColor("#E74C3C")
    .setTitle("\:x: Seems like something went wrong...")
    .setDescription("You do not have the `Manage Messages` permission for this action")
    .setFooter('SlashBot');
    await interaction.reply({ embeds: [embed] })
  }
}

  if (commandName === "delete") {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
    const commandAdd = interaction.options.getString('command');
    console.log(commandAdd)
    var cmdguild = interaction.guild.id
    var initialcmdArr = db.get().state[`${interaction.guild.id}`]

    function getByValue(arr, value) {

      for (var i=0, iLen=arr.length; i<iLen; i++) {
    
        if (arr[i].command == value) return arr[i];
      }
    }

    matchedObj = getByValue(initialcmdArr,commandAdd)
    console.log(matchedObj + " -")

    if (!commandAdd) {
      const embed = new MessageEmbed()
      .setColor("#E74C3C")
		  .setTitle("\:x: Seems like something went wrong...")
		  .setDescription("ERROR - Please enter the required parameters:\n\n**Command Usage:**\n\`/delete command:test\`")
      .setFooter('SlashBot');
      await interaction.reply({ embeds: [embed] })
    } else if (commandAdd) {
      if (!matchedObj) {
        console.log("Not Found " + matchedObj)
        const embed = new MessageEmbed()
        .setColor("#E74C3C")
        .setTitle("\:x: Seems like something went wrong...")
        .setDescription(`\`${commandAdd}\` was not found.\n\nUse \`/list\` to check your custom command list.`)
        .setTimestamp()
        .setFooter('SlashBot');
        await interaction.reply({ embeds: [embed] })
      } else if (matchedObj) {
          console.log(db.get().state[`${interaction.guild.id}`])
        delIndex = initialcmdArr.findIndex(x => x.command === commandAdd)
        db.get(interaction.guild.id).get(delIndex).delete(true)
        db.save()
        const embed = new MessageEmbed()
        .setColor("#3498DB")
        .setTitle(`\`/${commandAdd}\` has been deleted`)
        .setFooter('SlashBot')
        .setTimestamp()
        await interaction.reply({ embeds: [embed] })

      var cmdArr = db.get().state[`${interaction.guild.id}`]
      var commands = []

      for (var i = 0; i < cmdArr.length; i++) {
        commands.push(new SlashCommandBuilder().setName(cmdArr[i].command).setDescription('Custom Command'),)
      }
      console.log(commands)
      //cmdIndex = commands.findIndex(x => x.includes(commandAdd))

      commands.map(command => command.toJSON());

      const rest = new REST({ version: '9' }).setToken(token);

      rest.put(Routes.applicationGuildCommands(clientId, cmdguild), { body: commands })
        .then(() => console.log('Successfully registered commands for server'))
        .catch(console.error);
        }
        
  }} else {
    const embed = new MessageEmbed()
    .setColor("#E74C3C")
    .setTitle("\:x: Seems like something went wrong...")
    .setDescription("You do not have the `Manage Messages` permission for this action")
    .setFooter('SlashBot');
    await interaction.reply({ embeds: [embed] })};

}})

// Login to Discord with your client's token
client.login(token);
