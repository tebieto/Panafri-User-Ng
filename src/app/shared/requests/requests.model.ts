export class Requests {
	constructor(
		public id: number, 
		public type: string, 
		public sender: number, 
		public receiver: number,
		public status: number,
		public delivery: number,
		public location: string,
		public seller_status: number,
		public buyer_status: number,  
		public created_at: string,
		public updated_at: string, 
		) {}
  }