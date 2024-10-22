const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong'),
	async execute(interaction) {
		await interaction.reply('https://tenor.com/view/die-idiot-idiot-getting-hurt-bigbuddiboi-fail-gif-19327787');
	},
};
