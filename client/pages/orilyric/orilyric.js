const config = require('../../config.js')
const util = require('../../utils/util.js')
const app = getApp()
const promise = require('../../utils/promise.js')
const moment = require('../../vendor/moment.min.js')
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
		//获取歌词
		wx.cloud.callFunction({
			name: 'get_lyric',
			data: {
				id: this.songId
			}
		})
		.then(res => {
			if(res.result){
				let result = JSON.parse(res.result)
				if (!result.lrc) {
					util.showError('没有歌词')
					const param = `items[0].disable`
					_this.setData({
						[param]: true
					})
					return
				}
				const oriLyric = result.lrc.lyric
					.replace(/\[[\d.:]+\]/g, '')
				_this.setData({ oriLyric })
			}
		})
		/*
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
	*/
	},

	//开始编辑歌词
	edit() {
		const _this = this
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
		//上传歌词到服务器
		const db = wx.cloud.database()
		db.collection('songs').add({
			data: {
				song: {
					songId: this.songId,
					songName: this.songName,
					artistName: this.artistName,
					tab: tab,
					info: [
						{ title: 'Key', value: '' },
						{ title: 'Play', value: '' },
						{ title: 'Capo', value: '' },
					],
				},
				createDate: db.serverDate(),
				updateDate: db.serverDate()
			}
		})
			.then(res => wx.redirectTo({
				url: `../tab/tab?songId=${_this.songId}`,
			}))
		/*
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
					],

				},
				date: moment().unix()
			}, 'POST'))
			.then(res => {
				if (res.data.code != 1985) {
					util.log.error(res)
					throw ''
				}

				wx.redirectTo({
					url: `../tab/tab?songId=${this.songId}`,
				})
			})
			.catch(err => { util.showError })
	*/
	},
})