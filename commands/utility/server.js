const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Component } = require('discord.js');
const {exec} = require("child_process");
const wait = require('node:timers/promises').setTimeout;

const serverURL = "G:\\Vintage Story\\Vintagestory.exe" // File goes here

let isStarted = false;



const startButton = new ButtonBuilder()
.setCustomId('startButton')
.setLabel('Start')
.setStyle(ButtonStyle.Success)

const stopButton = new ButtonBuilder()
.setCustomId('stopButton')
.setLabel('Stop')
.setStyle(ButtonStyle.Danger)

const row = new ActionRowBuilder()
.addComponents(startButton,stopButton)



async function serverStart(interaction) {
	if (isStarted === false) {
		isStarted = true;
		await interaction.reply("Attempting communication with server file...");

		
	}
	else {
		console.log("isStarted = true");
		await interaction.reply({content: "Server already started lol", ephemeral: true});
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Starts the vintage server.'),
	async execute(interaction) {
		interaction.reply({content: "What do you want to do with the server?", components: [row]})
		
	},
};
