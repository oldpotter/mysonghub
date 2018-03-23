// pages/edit/pad.js
Component({

	properties: {
		show: Boolean,
		chord: String,
		recentItems: Array
	},

	data: {
		chord: '',
		items: [
			{
				idx: 0, item: [
					'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'
				]
			},
			{
				idx: 1, item: [
					'm', '#', 'b', 'add', 'sus', 'maj', 'min', '+', '-', '/',
					'1', '2', '3', '4', '5', '6', '7', '9', '11', '13'
				]
			},]
	},

	methods: {
		onClickBtn(event) {
			const position = event.currentTarget.dataset.position
			const value = this.data.items[position.split('-')[0]].item[position.split('-')[1]]
			let chord = this.data.chord
			chord = chord + value
			this.setData({ chord })
		},

		ok() {
			this.setData({
				show: false
			})
			this.triggerEvent('onclickok', this.data.chord, {})
		},

		del() {
			this.setData({ chord: '' })
		},

	}
})
