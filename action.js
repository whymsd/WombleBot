export class Action{

	//1 = Heal
	//2 = Kill
	//3 = Investigate

	constructor(type, doer, subj, prio){
		this.type = type;
		this.doer = doer;
		this.subj = subj;
		this.prio = prio; 
		//console.log("PLAYER ADDED: " + this.ID + ", " + this.role);
	}

	voting(v){
		//vote = 
	}
}