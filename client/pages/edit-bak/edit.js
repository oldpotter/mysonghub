const config = require('../../config.js')
const util = require('../../utils/util.js')
const app = getApp()
Page({
	data: {
		showEditChordInput: false,//编辑框
		array: undefined,
		hiddenInput: true,
		position: undefined,
		isEditing: false,
		recentUsedScales: [],
		scales: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'],
		kinds: ['dim', 'aug', '3', '4', '5', '6', '7', '9', 'add', '11', '13', 'sus2', 'sus4', '-', '+', '/'],
		resChord: undefined,
	},

	onLoad(options) {
		this.songId = options.songId
		if (options.index) {//本地数据
			this.setData({
				array: app.songs[options.index].tab,
				songInfo:app.songs[options.index].songInfo
			})
			console.log('songInfo:',this.data.songInfo)
			return
		}
		this.songName = options.songName
		const _this = this
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
					const strLyric = obj.lrc.lyric
						.replace(/\[[\d.:]+\]/g, '\n')
					let array = strLyric.split('\n')
					array = array.map(item => {
						const blanks = []
						for (let i = 0; i < 20; i++) {
							blanks.push('&nbsp;'.repeat(4))
						}
						return item = {
							isBlank: item == '',
							value: item == '' ? blanks : '&nbsp;'.repeat(4).concat(item)
						}
					})
					_this.setData({ array })
				}
			},
			fail: function (res) {
				console.error(res)
			},
			complete: function (res) {
				wx.hideLoading()
			},
		})
	},

	//点击某个和弦
	onClickChord(event) {
		this.setData({
			hiddenInput: false,
			position: event.currentTarget.dataset.position
		})
	},


	onClickSave() {
		const newSong = app.songs.every((song, index, songs) => {
			if (song.songId == this.songId) {
				songs[index].tab = this.data.array
				songs[index].songInfo = this.data.songInfo
				return false
			}
			return true
		})
		if (newSong) {
			app.songs.push({
				songId: this.songId,
				songName: this.songName,
				tab: this.data.array,
				songInfo: this.data.songInfo
			})
		}
		wx.setStorage({
			key: 'songs',
			data: app.songs,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) {
				wx.showToast({
					title: '保存成功',
					icon: 'success',
					image: '',
					duration: 1500,
					mask: true,
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
			},
		})
	},

	onClickEdit() {
		const isEditing = !this.data.isEditing
		this.setData({ isEditing })
	},

	onClickDeleteLyric(event) {
		const index = event.currentTarget.dataset.position
		// console.log(this.data.array[index - 1])
		// console.log(this.data.array[index])
		const array = this.data.array
		array.splice(index - 1, 2)
		// console.log(array)
		this.setData({ array })
	},

	//点击一个和弦按钮
	onClickScaleItem(event) {
		const chord = event.currentTarget.dataset.chord
		let resChord = this.data.resChord || ''
		resChord = resChord + chord
		this.setData({ resChord })
	},

	//编辑和弦
	onClickEditChord() {
		this.setData({
			showEditChordInput: true
		})
	},

	//删除输入的和弦
	onClickDeleteChord() {
		this.setData({
			resChord: ''
		})
	},
	//关闭和弦输入区域
	onClickCloseInput() {
		this.setData({
			hiddenInput: true,
		})
	},
	//确定输入的和弦
	onClockConfirmInput() {
		const position = this.data.position
		const rowIndex = position.split('-')[0]
		const columnIndex = position.split('-')[1]
		const param = `array[${rowIndex}].value[${columnIndex}]`
		const recentUsedScales = this.data.recentUsedScales
		if (!recentUsedScales.some(c => c == this.data.resChord)) {
			recentUsedScales.push(this.data.resChord)
			this.setData({
				recentUsedScales: recentUsedScales,
			})
		}
		this.setData({
			[param]: this.data.resChord,
			hiddenInput: true,
			resChord: undefined
		})
	},

	//编辑和弦保存
	onClickConfirmEdit(event) {
		const chord = event.detail.value
		this.setData({
			resChord: chord,
			showEditChordInput: false,
		})
	},

	//编辑和弦取消
	onClickCancelEdit() {
		this.setData({
			showEditChordInput: false,
		})
	},

	onSongInfoSaved(event) {
		const songInfo = event.detail
		this.setData({ songInfo })
	}
})