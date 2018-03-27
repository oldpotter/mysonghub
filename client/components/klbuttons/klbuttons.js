Component({
	properties: {
		items: Array,
		hidden: Boolean
	},

	ready() {
		const items = this.data.items
		items.forEach(i => i.on = false)
		this.setData({ items })
	},

	methods: {
		tap(event) {
			const index = event.currentTarget.dataset.index
			const param = `items[${index}].on`
			this.setData({
				[param]: !this.data.items[index].on
			})
			if (this.data.items[index].autoOff && this.data.items[index].on) {
				setTimeout(()=>this.setData({
					[param]:false
				}),1000)
			}
			this.triggerEvent('ontap', { index }, {})
		}
	}
})