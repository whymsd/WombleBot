export class Player{

	constructor(ID, role, align){
		this.ID = ID;
		this.role = role;
		this.align = align;
		this.status = 1; //ALIVE
		this.vote = 0;
		this.votes = 0; 
		//console.log("PLAYER ADDED: " + this.ID + ", " + this.role);
	}

	voting(v){
		console.log(v);
	}
}