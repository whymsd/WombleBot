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
	}

	startGame(){
		//console.log("Mode is: " + this.mode); - WORKS
		switch(this.mode){
			case 'standard':
				this.roles=["Villager", "Villager", "Villager", "Mafioso", "Mafioso", "Detective", "Doctor"];
				this.align=["Town", "Town", "Town", "Mafia", "Mafia", "Town", "Town"];
			break;
		}
		//console.log("Roles are: " + this.roles); - WORKS
		var i;
		for(i = 0; this.playerIDs.length>0; i++){
			var j = Math.floor(Math.random() * (this.playerIDs.length));
			//console.log(j + ", " + this.playerIDs[j] + ", " + this.roles[i]);
			this.players.push(new Player(this.playerIDs[j], this.roles[i], this.align[i]));
			//console.log(this.players[i].role + " + " + this.players[i].ID);
			this.playerIDs.splice(j, 1);
		}
		console.log(this.gameChannel);
		this.startDay();
	}

	startDay(){
		botman.intro(this.gameChannel);
	}
}