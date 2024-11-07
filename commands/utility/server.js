const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,  } = require('discord.js');
const {spawn} = require('node:child_process');
const { stdout, stderr } = require('node:process');
const { setTimeout } = require('node:timers/promises');

const serverURL = 'G:\\Vintage Story\\VintagestoryServer.exe' // File goes here






const startButton = new ButtonBuilder()
.setCustomId('startButton')
.setLabel('Start')
.setStyle(ButtonStyle.Success)
.setDisabled(false)

const stopButton = new ButtonBuilder()
.setCustomId('stopButton')
.setLabel('Stop')
.setStyle(ButtonStyle.Danger)
.setDisabled(true)

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
				serverStop(interaction);
				await confirmation.update({ content: 'Now awaiting autosave to stop server...', components: [] });
				isStarted = false;
				
			}
		} catch (e) {
			await interaction.editReply({ content: 'answer within one minute lmao', components: [] });
		}
	},
};

// serverStart() and serverStop() here

 

function serverStart() {
	
	const defaults = {
		cwd: undefined,
		stdio : [
			'pipe', 
			'pipe',
			'pipe' 
		],
		
	  }; 

	if (isStarted === false) {
		isStarted = true;
		startButton.setDisabled(true);
		stopButton.setDisabled(false);

		globalThis.ls = spawn(serverURL,[], defaults );
		ls.stdout.on('data', (data) => {
			let stdoutData = data
			console.log(`stdout: ${stdoutData}`);
		  });
		  
		  ls.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
			startButton.setDisabled(false);
			stopButton.setDisabled(true);
		  });
		  ls.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			startButton.setDisabled(false);
			stopButton.setDisabled(true);
		  });
		  
		  
	}
	else {
		console.log("isStarted = true");
		interaction.followUp({content: "Server already started lol", ephemeral: true});
	}
};

// when function is called, it waits til stdout states the server is done autosaving, then (hopefully) kills the subprocess when its safe to do so.
 async function serverStop(interaction) { 

	if (!ls) {
		interaction.followUp('wait til server up pls');
		return;
	}
	if(ls) {
		ls.stdout.on('data', (data) => {
			let str = data.toString();
			console.log(`thingy: ${str}`)
				if (str.includes('[Server Event] Offthread save of savegame done') && !str.includes('[Server Chat]')) {
					ls.kill();
					isStarted = false;
					console.log('String included, now killing process');
					startButton.setDisabled(false);
					stopButton.setDisabled(true);
				}
			
		})
	}
}