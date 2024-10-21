const { SlashCommandBuilder } = require('discord.js');
const {exec} = require("child_process");

const serverURL = "G:\\Vintage Story\\Vintagestory.exe"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverstart')
		.setDescription('Starts the vintage server.'),
	async execute(interaction) {
        interaction.reply("Server starting, Please wait.")
	},
};
