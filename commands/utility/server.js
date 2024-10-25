const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Component } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const {exec, execFile, execFileSync, spawn} = require('node:child_process');
const { stdout, stderr } = require('node:process');

const serverURL = 'G:\\Vintage Story\\VintagestoryServer.exe' // File goes here





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



let isStarted = false;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Starts the vintage server.'),
	async execute(interaction) {
		//initial reply		
		const response = await interaction.reply({content: "What do you want to do with the server?", components: [row]})
		response
		//confirmation 
		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
			confirmation
			if (confirmation.customId === 'startButton') {
				if(isStarted === false){
				serverStart();
				console.log("running serverStart()");
				await confirmation.update({ content: 'Server starting... (if no error appears, everything is going fine.)', components: [] });
				}
				else {
					await confirmation.update({ content: 'server already started lol', components: [] });
				}
			} 
			else if (confirmation.customId === 'stopButton') {
				serverStop();
				console.log("ending server");//add endserver() here
				await confirmation.update({ content: 'Server stopping', components: [] });
				isStarted = false;
				
			}
		} catch (e) {
			await interaction.editReply({ content: 'answer within one minute lmao', components: [] });
		}
	},
};

// serverStart() and serverStop() here

async function serverStart() {
	
	const defaults = {
		cwd: undefined
		
	  }; 

	if (isStarted === false) {
		isStarted = true;
		
		ls = spawn(serverURL,[], defaults );
		ls.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		  });
		  
		  ls.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		  });
		  
		  ls.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
		  });
		  
	}
	else {
		console.log("isStarted = true");
		await interaction.followUp({content: "Server already started lol", ephemeral: true});
	}
}; // currently not working will fix later - 10/24/24
async function serverStop() { 
	isStarted = false;
	console.log("handling serverStop()");
	if (lss){
	ls.stdin.write('/stop\n');
	ls.stdin.end(); 
	console.log("ls is here");
}
};