const config = require('../../config.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({
	songId: undefined,
	songName: undefined,
	data: {
		oriLyric: undefined,
		items: [
			{
				idx: 1,
				title: '编辑',
				on: false,
				src: '../../resources/edit.png',
			},
		]
	},

	onLoad(options) {
		const _this = this
		this.songId = options.songId
		this.songName = options.songName
		if (!this.songId) {
			wx.showToast({
				title: 'songId不存在',
				icon: 'error',
				image: '',
				duration: 0,
				mask: true,
				success: function (res) { },
				fail: function (res) { },
				complete: function (res) { },
			})
		}
		wx.showLoading({
			title: '',
			mask: true,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
		wx.request({
			url: `${config.service.lyricUrl}${this.songId}`,
			success: function (res) {
				if (res.statusCode == 200) {
					const obj = JSON.parse(res.data.data.body)
					if (!obj.lrc) {
						wx.showToast({
							title: '没有歌词',
							icon: '',
							image: '../../resources/error.png',
							duration: 2000,
							mask: true,
							success: function (res) { },
							fail: function (res) { },
							complete: function (res) { },
						})
						const param = `items[0].disable`
						_this.setData({
							[param]: true
						})
						console.log(_this.data.items)
						return
					}
					const oriLyric = obj.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '')
					_this.setData({ oriLyric })
					wx.hideLoading()
				}
			},
			fail: function (res) {
				console.error(res)
			},
		})
	},

	//开始编辑歌词
	edit() {
		if (!this.data.oriLyric) {
			return
		}
		let tab = this.data.oriLyric
		tab = tab.split('\n')
			.map(line => {
				const arr = line.split('')
				for (let i = 0; i < 4; i++) {
					arr.push('&nbsp;&nbsp;')
					arr.splice(0, 0, '&nbsp;&nbsp;')
				}

				return arr.map(word => {
					const item = {
						chord: '',
						word: word
					}
					return item
				})
			})

		app.songs.push({
			songId: this.songId,
			songName: this.songName,
			tab: tab
		})
		wx.setStorage({
			key: 'songs',
			data: app.songs,
		})
		wx.redirectTo({
			url: '../tab/tab',
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
})