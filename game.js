var botman = require('./bot.js');

import { Player } from './player.js';
import { Action } from './action.js';

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
		this.lynchstat = 0;
		this.actions = [];
	}

	startGame(){
		//console.log("Mode is: " + this.mode); - WORKS
		switch(this.mode){
			case 'standard':
				this.roles=["Doctor", "Detective", "Mafioso", "Mafioso", "Villager", "Villager", "Villager"];
				this.align=["Town", "Town", "Mafia", "Mafia", "Town", "Town", "Town"];
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
		this.time="DAY";
		this.lynchstat = 0;
		this.actions=[];
		this.voteThreshhold = this.players.length / 2;
		console.log(this.voteThreshhold);
		this.voteThreshhold = Math.ceil(this.voteThreshhold);
		setTimeout(botman.noLynchMessage, 60000, this.lynchstat);
	}

	lynch(lynchID){
		var i = 0;
		while (this.players[i].ID != lynchID){
			i++;
		}
		this.players.splice(i, 1);
		this.voteThreshhold = this.players.length / 2;
		this.lynchstat = 1;
		this.checkMafWin();
		setTimeout(botman.nightMessageEx, 5000); 
	}

	startNight(){
		this.time="NIGHT";
		this.daycount++;
		setTimeout(botman.actionCaller, 30000);
	}

	checkMafWin(){
		var counter = 0;
		var i;
		for(i = 0; i < this.players.length; i++){
			if(this.players[i].align === "Mafia"){
				counter++;
			}
		}
		if(counter >= this.voteThreshhold){
			// EXECUTE MAFIA VICTORY
		}
		else{
			//console.log("Maf count = " + counter);
		}
	}

	addAction(act, user, subj, prio){
		var i;
		for(i = 0; i < this.actions.length; i++){
			//console.log("action looping")
			if(this.actions[i].doer = user){
				this.actions.splice(i, 1);
				i--;
				//console.log("Got rid of a thing");
			}
		}
		//console.log("Adding action type " + act);
		var index = findPlayer(user);
		if(this.players[index].ID === type){
			this.actions.push(new Action(act, user, subj, prio));
		}
		else{
			botman.genericPrint(this.user, "Your role cannot perform that action!")
		}
	}

	actionResolve(){
		var i;
		var j;
		for (i = 0; i < (this.actions.length - 1); i++){
			for(j = 1; j < this.actions.length; j++){
				if(this.actions[i].prio > this.actions[j].prio){
					var tmp = this.actions[i];
					this.actions[i] = this.actions[j];
					this.actions[j] = tmp;
				}
			}
			var doing = this.actions[i].type;
			switch(doing){
				case 'Mafia':
						console.log("SNEAKY SNEAKY");
				break;
				case 'Detective':
						console.log("WHODUNNIT");
				break;
				case 'Doctor':
						console.log("VALKYRIE ONLINE");
				break;
			}
		}
		setTimeout(botman.dayMessage, 30000, this.gameChannel, this.daycount);
	}

	findPlayer(id){
		var i;
		for(i = 0; i < this.players.length; i++){
			if(this.players[i].ID = id){
				return i;
			}
		}
	}

}