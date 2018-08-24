var botman = require('./bot.js');

import { Player } from './player.js';
import { Action } from './action.js';
import { PlayerHolder } from './playerHolder.js';

export class Game{

	constructor(mode, entryID, entryName, gameChannel){
		this.mode = mode;
		this.playerIDs = [];
		this.playerIDs.push(new PlayerHolder(entryID, entryName));
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
		switch(this.mode){
			case 'standard':
				this.roles=["Doctor", "Detective", "Mafioso", "Mafioso", "Villager", "Villager", "Villager"];
				this.align=["Town", "Town", "Mafia", "Mafia", "Town", "Town", "Town"];
			break;
		}
		var i;
		for(i = 0; this.playerIDs.length>0; i++){
			var j = Math.floor(Math.random() * (this.playerIDs.length));
			this.players.push(new Player(this.playerIDs[0].ID, this.roles[j], this.align[j], this.playerIDs[0].name));
			this.playerIDs.splice(0, 1);
			this.roles.splice(j, 1);
			this.align.splice(j, 1);
		}
		setTimeout(botman.introMessage, 3000, this.gameChannel);
		setTimeout(botman.dayMessage, 5000, this.gameChannel, this.daycount);
	}

	startDay(){
		this.time="DAY";
		this.lynchstat = 0;
		this.actions=[];
		this.voteClear();
		var i;
		for (i = 0; i < this.players.length; i++){
			this.players[i].status = 0;
		}
		this.voteThreshhold = this.players.length / 2;
		//console.log(this.voteThreshhold);
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
		this.voteClear();
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
		var index = this.findPlayer(user);
		if(this.players[index].role === act){
			console.log("Comparing role " + this.players[index].role + " to action " + act);
			botman.genericPrint(user, "Action recorded. Any previous action has been overwritten.");
			this.actions.push(new Action(act, user, subj, prio));
		}
		if(this.players[index].role != act){
			console.log("We got here, you can't do this");
			botman.genericPrint(user, "Your role cannot perform that action!")
		}
	}

	actionResolve(){
		if(this.actions.length > 0){
			console.log("Action undertaken: " + this.actions[0].type + ", " + this.actions[0].doer + ", " + this.actions[0].subj + ", " + this.actions[0].prio);
			var i = 0;
			var j;
			for (i = 0; i < (this.actions.length - 1); i++){
				for(j = 1; j < this.actions.length; j++){
					if(this.actions[i].prio > this.actions[j].prio){
						var tmp = this.actions[i];
						this.actions[i] = this.actions[j];
						this.actions[j] = tmp;
					}
				}
				this.actionExecution(this.actions[i]);
			}
			this.actionExecution(this.actions[i]);
			this.mafKill();
		}
		setTimeout(botman.dayMessage, 5000, this.gameChannel, this.daycount);
	}

	findPlayer(id){
		var i;
		for(i = 0; i < this.players.length; i++){
			if(this.players[i].ID == id){
				return i;
			}
		}
	}

	findByName(name){
		var i;
		for(i = 0; i < this.players.length; i++){
			if(this.players[i].name == name){
				return i;
			}
		}
	}

	actionExecution(action){
		var doing = action.type;
		switch(doing){
			case 'Mafioso':
				var ind = this.findPlayer(action.doer);
				var ind2;
				if(this.players[ind].vote!=0){
					ind2 = this.findPlayer(this.players[ind].vote);
					this.players[ind2].votes--;
				}
				ind2 = this.findByName(action.subj);
				console.log("actionExecution on " + this.players[ind2].ID + ", " + this.players[ind2].role + ", " + this.players[ind2].align + ", " + this.players[ind2].name);
				this.players[ind2].votes++;
				botman.genericPrint(action.doer, "Your vote was to kill <@" + this.players[ind2].ID + ">.");
			break;
			case 'Detective':
				var ind = this.findByName(action.subj);
				//console.log("actionExecution " + this.players[ind].ID + ", " + this.players[ind].role + ", " + this.players[ind].align + ", " + this.players[ind].name);
				var alignOut = this.players[ind].align;
				botman.genericPrint(action.doer, "Your investigation into <@" + this.players[ind].ID + "> has revealed them to be aligned with the " + alignOut + "!");
			break;
			case 'Doctor':
				var ind = this.findByName(action.subj);
				//console.log("actionExecution " + this.players[ind].ID + ", " + this.players[ind].role + ", " + this.players[ind].align + ", " + this.players[ind].name);
				this.players[ind].status = 1;
				botman.genericPrint(action.doer, "You healed <@" + this.players[ind].ID + "> during the night!");
			break;
		}
	}

	voteClear(){
		var i;
		for(i = 0; i < this.players.length; i++){
			this.players[i].vote = 0;
			this.players[i].votes = 0;
			this.players[i].playerLog();
		}
	}

	mafKill(){
		var i;
		var killed = [0];
		for(i = 1; i < this.players.length; i++){
			if(this.players[i].votes >= this.players[0].votes){
				if(this.players[i].votes > this.players[0].votes){
					killed = [];
				}
				killed.push(i);
			}
		}
		var a = Math.floor(Math.random() * (killed.length));
		var b = killed[a];
		if(this.players[b].votes > 0){
			for(i = 0; i < this.players.length; i++){
				if(this.players[i].role === "Mafioso"){
					botman.genericPrint(this.players[i].ID, "The Mafia voted to kill <@" + this.players[b].ID + ">.");
				}
			}
			if(this.players[b].status == 1){
				botman.genericPrint(this.players[b].ID, "You were attacked and healed last night!");
			}
			else{
				botman.genericPrint(this.players[b].ID, "You were attacked by the mafia last night. You died!");
				this.players.splice(b, 1);
			}
		}
	}

}