var botman = require('./bot.js');

import { Player } from './player.js';

export class Game{

	constructor(mode, entry, gameChannel){
		this.mode = mode;
		this.playerIDs = [entry];
		this.numberOfPlayers = 0;
		if(mode == "standard"){
			this.numberOfPlayers = 7;
		}
		this.roles = [];
		this.align = [];
		this.players = [];
		this.daycount = 1;
		this.time = "DAY";
		this.gameChannel =  gameChannel;
		this.voteThreshhold = 0;
	}

	startGame(){
		//console.log("Mode is: " + this.mode); - WORKS
		switch(this.mode){
			case 'standard':
				this.roles=["Doctor", "Detective", "Mafioso", "Mafioso", "Villager", "Villager", "Villager"];
				this.align=["Town", "Town", "Town", "Mafia", "Mafia", "Town", "Town"];
			break;
		}
		//console.log("Roles are: " + this.roles); - WORKS
		var i;
		for(i = 0; this.playerIDs.length>0; i++){
			var j = Math.floor(Math.random() * (this.playerIDs.length));
			this.players.push(new Player(this.playerIDs[0], this.roles[j], this.align[j]));
			this.playerIDs.splice(0, 1);
			this.roles.splice(j, 1);
			this.align.splice(j, 1);
		}
		//console.log(this.gameChannel);
		setTimeout(botman.introMessage, 3000, this.gameChannel);
		setTimeout(botman.dayMessage, 5000, this.gameChannel, this.daycount);
	}

	startDay(){
		this.voteThreshhold = this.players.length;
	}
}