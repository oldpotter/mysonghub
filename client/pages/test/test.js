const moment = require('../../vendor/moment.min.js')
Page({
	scrollTop:0,
	data: {
		items: undefined
	},

	onLoad() {
		let i = 0
		let items = []
		while (i < 50) {
			items.push(i)
			i++
		}
		this.setData({ items })
	},

	onPageScroll(event) {
		this.scrollTop = event.scrollTop
	},

	click() {
		this.scrollTop += 50
		wx.pageScrollTo({
			scrollTop: this.scrollTop,
			duration: 500,
		})
	}
})