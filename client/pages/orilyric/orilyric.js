const config = require('../../config.js')
const util = require('../../utils/util.js')
const app = getApp()
const promise = require('../../utils/promise.js')
Page({
	songId: undefined,
	songName: undefined,
	data: {
		oriLyric: undefined,
		items: [
			{
				idx: 1,
				title: '保存',
				on: false,
				src: '../../resources/save.png',
				srcOn: '../../resources/save.png',
			},
		]
	},

	onLoad(options) {
		const _this = this
		this.songId = options.songId
		this.songName = options.songName
		this.artistName = options.artistName
		if (!this.songId) {
			util.showError('songId不存在')
			return
		}
		promise.pRequest(`${config.service.lyricUrl}${this.songId}`)
			.then(res => {
				if (res.statusCode == 200) {
					const obj = JSON.parse(res.data.data.body)
					if (!obj.lrc) {
						util.showError('没有歌词')
						const param = `items[0].disable`
						_this.setData({
							[param]: true
						})
						return
					}
					const oriLyric = obj.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '')
					_this.setData({ oriLyric })
				}
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
				let arr = []
				if (/[\u4e00-\u9fa5]+/.test(line)) {
					arr = line.split('')
				} else {
					arr = line.split(/\b/)
				}
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

		promise.getUUID()
			.then(uuid => promise.pRequest(config.service.uploadSongUrl, {
				uuid, song: {
					songId: this.songId,
					songName: this.songName,
					artistName: this.artistName,
					tab: tab,
					info: [
						{ title: 'Key', value: '' },
						{ title: 'Play', value: '' },
						{ title: 'Capo', value: '' },
					]
				}
			}, 'POST'))
			.then(res => {
				if (res.data.code != 1985) {
					throw ''
				}
				wx.navigateTo({
					url: `../tab/tab?songId=${this.songId}`,
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
			})
			.catch(err => { util.showError })
	},
})