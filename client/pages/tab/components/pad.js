// pages/edit/pad.js
const util = require('../../../utils/util.js')
Component({

	properties: {
		show: Boolean,
		chord: String,
		recentItems: Array
	},

	data: {
		x: 0,
		y: 0,
		showChordPad: false,
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
			this.triggerEvent('pad', { event: 'ok', value: this.data.chord }, {})
		},

		del() {
			this.setData({ chord: '' })
		},
		chord() {
			this.setData({ showChordPad: true })
			const ctx = wx.createCanvasContext('myCanvas', this)
			const l = 50
			//竖线
			for (let i = 0; i < 6; i++) {
				ctx.moveTo(10 + i * l, 10)
				ctx.lineTo(10 + i * l, 10 + l * 4)
			}
			//横线
			for (let i = 0; i < 5; i++) {
				ctx.moveTo(10, 10 + i * l)
				ctx.lineTo(10 + l * 5, 10 + i * l)
			}
			ctx.stroke()
			ctx.draw()
		},
		bindTap(event) {
			// util.cs.log(`x:${event.touches[0].x},y:${event.touches[0].y}`)
		},
		start: function (e) {
			this.setData({
				x: e.touches[0].x,
				y: e.touches[0].y
			})
		},
		move: function (e) {
			this.setData({
				x: e.touches[0].x,
				y: e.touches[0].y
			})
		},
		end: function (e) {
			util.cs.log(`x:${this.data.x},y:${this.data.y}`)
		},
	}
})
