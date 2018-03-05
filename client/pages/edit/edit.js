const app = getApp()
Page({
	data: {
		tab: undefined,
		showPad: false,
		chord: '',
		param: '',
		recentChords: []
	},
	onLoad(options) {
		this.setData({
			tab: app.songs[app.songs.length - 1].tab
		})
		console.log(this.data.tab)
	},

	//点击一个歌词
	onClickRowItem(event) {
		const position = event.currentTarget.dataset.position
		const lineIdx = position.split('-')[0]
		const rowIdx = position.split('-')[1]
		const param = `tab[${lineIdx}][${rowIdx}].chord`
		this.setData({
			showPad: true,
			chord: this.data.tab[lineIdx][rowIdx].chord,
			param
		})
	},

	//关闭面板
	onPadClosed(event) {
		this.setData({
			[this.data.param]: event.detail
		})
		const recentChords = this.data.recentChords
		const exist = recentChords.some(chord => chord === event.detail)
		if (!exist) {
			recentChords.push(event.detail)
			this.setData({ recentChords })
		}
	}
})