const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config()
const clientId = process.env.clientId
const guildId = process.env.guildId
const token = process.env.token

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Check Bot Latency')
	.addStringOption(option => option.setName('debug').setDescription('Debugging Only')),
	new SlashCommandBuilder().setName('add').setDescription('Add a custom command')
	.addStringOption(option => option.setName('command').setDescription('Enter the Command'))
	.addStringOption(option => option.setName('output').setDescription('Enter the output')),
	new SlashCommandBuilder().setName('delete').setDescription('Delete a custom command')
	.addStringOption(option => option.setName('command').setDescription('Enter the Command')),
	new SlashCommandBuilder().setName('list').setDescription('List custom commands'),
	new SlashCommandBuilder().setName('setup').setDescription('Setup CC-bot for the first time'),
	new SlashCommandBuilder().setName('help').setDescription('Show help message'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
).then(() => console.log('Successfully registered application commands.')).catch(console.error);
