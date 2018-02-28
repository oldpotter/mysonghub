const config = require('../../config.js')
Page({
	data: {
		keywords: undefined,
		songs: undefined
	},

	onInput(event) {
		this.setData({ keywords: event.detail.value })
	},

	onClickSearch() {
		const _this = this
		wx.request({
			url: `${config.service.searchUrl}${_this.data.keywords}&limit=10`,
			success: function (res) {
				if (res.statusCode == 200) {
					const json = JSON.parse(res.data.data.body)
					if (json.code == 200) {
						_this.setData({ songs: json.result.songs })
					}
				}
			},
			fail: function (res) {
				console.error(res)
			},
			complete: function (res) { },
		})
	},

	onClickSong(event) {
		const index = event.currentTarget.dataset.index
		const songId = this.data.songs[index].id
		const songName = this.data.songs[index].name
		console.log(this.data.songs[index].id)
		wx.navigateTo({
			url: `../edit/edit?songId=${songId}&songName=${songName}`,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
})