Component({
	properties: {
		isEditing: Boolean,
		info: {
			type: Array,
			value: [
				{
					title: 'Key',
					value: ''
				},
				{
					title: 'Play',
					value: ''
				},
				{
					title: 'Capo',
					value: ''
				},]
		}
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