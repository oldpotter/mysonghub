Component({
	properties:{
		holder:String,
		focus:Boolean
	},
	search: undefined,
	methods: {
		input(event) {
			clearTimeout(this.search)
			const value = event.detail.value
			this.search = setTimeout(() => {
				this.triggerEvent('klsearch', { value }, {})
			}, 1000)
		}
	}
})