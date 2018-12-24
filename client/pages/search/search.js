const config = require('../../config.js')
const promise = require('../../utils/promise.js')
Page({
	data: {
		songs: undefined
	},


	bindSearch(event) {
		//搜索歌曲
		const _this = this
		const value = event.detail.value
		wx.cloud.callFunction({
			name: 'search_song',
			data: {
				keywords: value
			}
		})
		.then(res => {
			if(res.result){
				let result = JSON.parse(res.result)
				result = result.result
				_this.setData({ songs: result.songs })
				// console.log('找到', result.songs.length)
			}
		})
		.catch(console.error)
		/*
		promise.pRequest(`${config.service.searchUrl}${value}`)
			.then(res => {
				if (res.statusCode == 200) {
					const json = JSON.parse(res.data.data.body)
					if (json.code == 200) {
						_this.setData({ songs: json.result.songs })
					}
				}
			})
	
	*/
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