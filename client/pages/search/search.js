const config = require('../../config.js')
const promise = require('../../utils/promise.js')
Page({
	data: {
		songs: undefined
	},


	bindSearch(event) {
		const _this = this
		const value = event.detail.value
		promise.pRequest(`${config.service.searchUrl}${value}`)
			.then(res => {
				if (res.statusCode == 200) {
					const json = JSON.parse(res.data.data.body)
					if (json.code == 200) {
						_this.setData({ songs: json.result.songs })
					}
				}
			})
	},


	onClickSong(event) {
		const index = event.currentTarget.dataset.index
		const songId = this.data.songs[index].id
		const songName = this.data.songs[index].name
		const artistName = this.data.songs[index].artists[0].name
		wx.navigateTo({
			url: `../orilyric/orilyric?songId=${songId}&songName=${songName}&artistName=${artistName}`,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
})