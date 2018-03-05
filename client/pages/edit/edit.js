const app = getApp()
Page({
	data: {
		tab: undefined,
	},
	onLoad(options) {
		// console.log(options)
		// console.log(app.songs[app.songs.length - 1].tab)
		this.setData({
			tab: app.songs[app.songs.length - 1].tab
		})
		console.log(this.data.tab)
	},

	onClickRowItem(event) {
		const position = event.currentTarget.dataset.position
		const lineIdx = position.split('-')[0]
		const rowIdx = position.split('-')[1]
		const a = this.data.tab[lineIdx][rowIdx]
		const param = `tab[${lineIdx}][${rowIdx}].chord`
		this.setData({
			[param]:'Cm7-5'
		})
	},
})