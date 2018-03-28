Component({
	properties: {
		isEditing: Boolean,
		/**
		 * title:String
		 * value:String
		 */
		info:Array,
	},

	ready(){
		console.log(`sssss:${this.data.info}`)
	},

	methods: {
		bindinput(event) {
			const index = event.currentTarget.dataset.index
			const value = event.detail.value
			const info = this.data.info
			info[index].value = value
			this.triggerEvent('info', { info }, {})
		}
	}
})