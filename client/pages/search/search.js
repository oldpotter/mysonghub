const config = require('../../config.js')
Page({
	data: {
		songs: undefined
	},

	onReachBottom(){
	},

	bindSearch(event){
		wx.showLoading({
			title: '正在搜索',
			mask: true,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
		const _this = this
		const value = event.detail.value
		wx.request({
			url: `${config.service.searchUrl}${value}`,
			success: function (res) {
				wx.hideLoading()
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
		// console.log(this.data.songs[index].id)
		wx.navigateTo({
			url: `../orilyric/orilyric?songId=${songId}&songName=${songName}`,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
})