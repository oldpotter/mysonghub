Component({
	properties: {
		items: Array,
		hidden: Boolean
	},

	methods: {
		tap(event) {
			const index = event.currentTarget.dataset.index
			// const param = `items[${index}].on`
			// this.setData({
			// 	[param]: !this.data.items[index].on
			// })
			this.triggerEvent('ontap',{index},{})
		}
	}
})