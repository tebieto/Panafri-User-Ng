export class Services {
	constructor(
		public id: number, 
		public name: string, 
		public price: number, 
		public owner: number,
		public type: number, 
		public description: string, 
		public category: string, 
		public location: string,
		public status: number,
		public image: string, 
		public created_at: string,
		public updated_at: string, 
		) {}
  }