export class Game{

	constructor(mode, entry){
		this.mode = mode;
		this.players = [entry];
		this.numberOfPlayers = 0;
		if(mode == "standard"){
			this.numberOfPlayers = 7;
		}
	}
}