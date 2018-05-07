Component({
	properties:{
		source:{
			type:Array,
			value:[]
		},
		isLoading:Boolean,
		error:Boolean
	},

	methods:{
		bindtap(){
			this.triggerEvent('kllist',{},{})
		},
	}
})