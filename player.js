export class Player{

	constructor(ID, role, align, name){
		this.ID = ID;
		this.role = role;
		this.align = align;
		this.name = name;
		this.status = 0; //ALIVE
		this.vote = 0;
		this.votes = 0; 
		console.log("PLAYER RECORDED: " + this.ID + ", " + this.role + ", " + this.align + ", " + this.name);
	}

	playerLog(){
		console.log("PLAYER ADDED: " + this.ID + ", " + this.role + ", " + this.align + ", " + this.name);
	}
}