
import { writable } from "svelte/store"


let _m = {
	fc:0,
	app: {},
	data : {},

	disabled_layers:[],

	config: {
		boundary:{
			malaysia 		: [99.640623, 0.857777, 119.266349, 7.370785], // malaysia
			semenanjung : [99.640623, 0.857777, 105, 7.370785] // semenanjung
		},
		console:{
			color: 'magenta',
		},

	},

	user:{},
	filters:{},
	defaultState:{},

};

export let M = writable(_m);
