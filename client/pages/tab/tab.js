const app = getApp()
const config = require('../../config.js')
const promise = require('../../utils/promise.js')
const util = require('../../utils/util.js')
const moment=require('../../vendor/moment.min.js')
Page({
	/**
	 * song:{
	 * 	songName:
	 * 	artistName:
	 * 	info:
	 * 	tab:
	 * 	songId:
	 * }
	 */
	scrollTop: 0,//页面滚动距离px
	scrollTo: 0,//要滚到的距离
	scrollInterval: undefined,
	songId: undefined,
	/**
	 * artistName
	 * song:
	 * 		tab
	 * 		info
	 * songId
	 * songName
	 * uuid
	 */
	item: undefined,
	changed: false,//是否有修改

	data: {
		showBtns: true,//显示页面底部功能按钮
		/**
		 * type:Array
		 * 	- type:Array
		 * 		-type:string , key:chord
		 * 		-type:string  , key:word
		 * 		-type:Array , key: chordInfo
		 */
		tab: undefined,
		showPad: false,//是否显示和弦面板
		showScrollPad: false,//是否显示调速面板
		showInfo: false,//显示信息
		showFont: false,
		tips: `编辑模式下：
		1、长按删除一行。
		2、点击单字添加和弦。`,//帮助
		isEditing: false,//是否处于编辑模式
		info: undefined,//谱子信息
		editingItem: undefined,//正在标记的单字
		editingItemIdx: undefined,//正在标记的单字idx
		recentChords: [],
	},

	onLoad(options) {
		if (app.setup.screenOn) {
			wx.setKeepScreenOn({
				keepScreenOn: true,
			})
		}
		//data数据初始化
		this.setData({
			guitarMode:app.setup.guitarMode,
			screenOn: app.setup.screenOn,//屏幕常亮
			fontSize: app.setup.fontSize || 1,
			items: [
				{
					idx: 2,
					title: '编辑',
					disable:!app.setup.guitarMode,
					on: false,
					src: '../../resources/edit.png',
					srcOn: '../../resources/edit_on.png',

				},
				{
					idx: 4,
					title: '保存',
					on: false,
					src: '../../resources/upload.png',
					srcOn: '../../resources/upload_on.png',
					autoOff: true
				},
				{
					idx: 1,
					title: '滚屏',
					on: false,
					disable:true,
					src: '../../resources/run.png',
					srcOn: '../../resources/run_on.png'
				},
				{
					idx: 6,
					title: '字体',
					on: false,
					src: '../../resources/font.png',
					srcOn: '../../resources/font_on.png',
				},
				{
					idx: 5,
					title: '屏幕',
					on: app.setup.screenOn,
					src: '../../resources/screen.png',
					srcOn: '../../resources/screen_on.png',
				},
				{
					idx: 999,
					title: '分享',
					on: false,
					src: '../../resources/share.png',
					srcOn: '../../resources/share_on.png',
					autoOff: true,
					isShare: true,
				},
				{
					idx: 3,
					title: '帮助',
					on: false,
					src: '../../resources/tip.png',
					srcOn: '../../resources/tip_on.png',
					autoOff: true
				},
				{
					idx: 7,
					title: '删除',
					on: false,
					src: '../../resources/delete.png',
					srcOn: '../../resources/delete_on.png',
					autoOff: true
				},
			]
		})
		this.songId = options.songId
		promise.pRequest(`${config.service.getSongUrl}?songId=${this.songId}`)
			.then(res => {
				if (res.data.code != 1985) throw {}
				this.item = res.data.data
				const song = JSON.parse(this.item.song)
				this.setData({
					tab: song.tab,
					info: song.info
				})
				for (let i = 0; i < this.data.tab.length; i++) {
					for (let j = 0; j < this.data.tab[i].length; j++) {
						if (this.data.tab[i][j].chordInfo) {
							const ctx = wx.createCanvasContext(`canvas-${i}-${j}`, this)
							this._drawChordInfo(ctx, this.data.tab[i][j].chordInfo)
						}
					}
				}
			})
			.catch(() => util.showError())
	},

	onUnload() {
		const _this = this
		app.setup.fontSize = this.data.fontSize
		app.setup.screenOn = this.data.screenOn
		wx.setStorageSync('setup', app.setup)
		if (this.changed) {
			wx.showModal({
				title: '',
				content: '有修改未保存，是否保存？',
				showCancel: true,
				cancelText: '不保存',
				cancelColor: '#ff0000',
				confirmText: '保存',
				confirmColor: '',
				success: function (res) {
					if (res.confirm) {
						_this._save()
					}
				},
				fail: function (res) { },
				complete: function (res) { },
			})
		}
	},

	onPageScroll(event) {
		this.scrollTop = event.scrollTop
		// if (this.scrollTop != this.scrollTo) {
		// 	console.log('onPageScroll-auto stop')
		// 	clearInterval(this.scrollInterval)
		// }
	},

	onShareAppMessage() {
		return {
			path: `/pages/tab/tab?songId=${this.item.songId}`,
			fail(res) {
				util.showError('转发失败')
			}
		}
	},

	_drawChordInfo(ctx, chordInfo) {
		const w = 8
		const h = 12
		const top = 10
		const left = 10
		ctx.setStrokeStyle('Black')
		//竖线
		for (let m = 0; m < 6; m++) {
			ctx.moveTo(left + m * w, top)
			ctx.lineTo(left + m * w, top + h * 4)
		}
		ctx.stroke()
		//横线
		ctx.setStrokeStyle('DarkGray')
		for (let m = 0; m < 5; m++) {
			ctx.moveTo(left, top + h * m)
			ctx.lineTo(left + w * 5, top + h * m)
		}
		ctx.stroke()
		chordInfo.forEach((value, idx) => {
			let a, b
			if (idx <= 5) {
				a = left + idx * w
				b = top - 2
				if (value != 0) {
					ctx.beginPath()
					ctx.setFontSize(8)
					ctx.setTextAlign('center')
					ctx.fillText(value == 1 ? 'o' : 'x', a, b)
				}
			} else if (idx == 30) {
				a = left - 5
				b = top + 6
				ctx.beginPath()
				ctx.setFontSize(10)
				ctx.setTextAlign('center')
				ctx.fillText(value + '', a, b)
			} else {
				idx -= 6
				a = left + idx % 6 * w
				b = top + parseInt(idx / 6) * h + h / 2
				if (value) {
					ctx.beginPath()
					ctx.arc(a, b, 3, 0, 2 * Math.PI)
					ctx.setFillStyle('Black')
					ctx.fill()
				}
			}
		})
		ctx.draw()
	},

	//字体大小
	bindFont(event) {
		let fontSize
		if (event.detail.value == '+') {
			fontSize = this.data.fontSize == 9 ? 9 : this.data.fontSize + 1
		} else {
			fontSize = this.data.fontSize == 1 ? 1 : this.data.fontSize - 1
		}
		this.setData({ fontSize })
	},

	//保存上传
	_save() {
		const _this = this
		promise.getUUID()
			.then(uuid => promise.pRequest(config.service.uploadSongUrl, {
				uuid, song: {
					tab: this.data.tab,
					info: this.data.info,
					songId: this.item.songId,
					songName: this.item.songName,
					artistName: this.item.artistName,
				},
				date: moment().unix()
			}, 'POST'))
			.then(res => {
				if (res.data.code != 1985) throw ''
				util.showSuccess('上传成功')
				_this.changed = false
			})
	},

	//点击功能按钮
	onClickKLButtons(event) {
		const _this = this
		const idx = event.detail.idx
		switch (idx) {
			//录音
			case 1000: {
				const param = `items[3].on`
				this.setData({
					[param]: !this.data.items[3].on
				})

				const recorderManager = wx.getRecorderManager()
				if (this.data.items[3].on) {
					recorderManager.onStart(() => {
						util.cs.log('recorder start')
					})
					recorderManager.onStop((res) => {
						util.cs.log('recorder stop', res)
						const { tempFilePath } = res
						const audioCtx = wx.createInnerAudioContext()
						audioCtx.src = tempFilePath
						audioCtx.onPlay(() => {
							util.cs.log('开始播放')
						})
						audioCtx.onError((res) => {
							util.cs.log(`播放出错啦:${JSON.stringify(res)}`)
							
						})
						audioCtx.play()
					})
					recorderManager.onFrameRecorded((res) => {
						const { frameBuffer } = res
						console.log('frameBuffer.byteLength', frameBuffer.byteLength)
					})
					const options = {
						duration: 1000 * 60 * 5,
						sampleRate: 44100,
						numberOfChannels: 1,
						encodeBitRate: 320000,
						format: 'mp3',
						frameSize: 50
					}
					recorderManager.start(options)
				} else {
					recorderManager.stop()
				}
				break
			}
			//滚屏
			case 1: {
				const showScrollPad = !this.data.showScrollPad
				this.setData({ showScrollPad })
				if (!showScrollPad) {
					clearInterval(this.scrollInterval)
				}
				break
			}
			//编辑
			case 2: {
				this.setData({ isEditing: !this.data.isEditing })
				if (!this.data.isEditing) {
					this.setData({ showPad: false })
				}
				break
			}
			//提示
			case 3: {
				this.setData({ showInfo: !this.data.showInfo })
				setTimeout(() => this.setData({ showInfo: !this.data.showInfo }), 3000)
				break
			}
			//上传
			case 4: {
				_this._save()

				break
			}
			//常亮
			case 5: {
				this.setData({ screenOn: !this.data.screenOn })
				wx.setKeepScreenOn({
					keepScreenOn: _this.data.screenOn,
				})

				break
			}
			//字体
			case 6: {
				this.setData({ showFont: !this.data.showFont })
				break
			}
			//删除
			case 7: {
				wx.showModal({
					title: '删除',
					content: '将从云端删除该文件，是否确定？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '',
					confirmText: '删除',
					confirmColor: '#ff0000',
					success: function (res) {
						if (res.confirm) {
							util.showBusy()
							promise.getUUID()
								.then(uuid => promise.pRequest(config.service.deleteSongUrl, { uuid, songId: _this.item.songId }, 'POST'))
								.then(res => {
									if (res.data.code != 1985) throw ''
									wx.navigateBack({
										delta: 1,
									})
								})
								.catch(() => util.showError())
								.finally(() => {
									wx.hideLoading()
								})
						}
					},
					fail: function (res) { },
					complete: function (res) { },
				})
				break
			}
		}
	},

	//scroll pad
	bindScrollPad(event) {
		const eventName = event.detail.event
		if (eventName == 'play') {
			const { isPlaying, value } = event.detail
			if (isPlaying) {
				//开始滚屏
				this.scrollInterval = setInterval(() => {
					this.scrollTo = this.scrollTop + value
					util.cs.log(`scroll to:${this.scrollTo}`)
					wx.pageScrollTo({
						scrollTop: this.scrollTo,
						duration: 1000,
					})
				}, 1000)
			} else {
				// 停止滚屏
				clearInterval(this.scrollInterval)
			}
			this.setData({ showBtns: !isPlaying })
		} else if (eventName == 'top') {
			wx.pageScrollTo({
				scrollTop: 0,
				duration: 1000,
			})
		}


	},

	//点击一个歌词
	onClickRowItem(event) {
		const position = event.currentTarget.dataset.position
		const lineIdx = position.split('-')[0]
		const rowIdx = position.split('-')[1]
		if (this.data.isEditing) {
			this.setData({ showBtns: false })
			this.changed = true
			this.setData({
				showPad: true,
				editingItem: this.data.tab[lineIdx][rowIdx],
				editingItemIdx: { lineIdx, rowIdx }
			})
		}

	},

	//长按一行
	onLongPressRowItem(event) {
		const _this = this
		wx.showActionSheet({
			itemList: ['删除'],
			itemColor: '#f43a2f',
			success: function (res) {
				const position = event.currentTarget.dataset.position
				const index = position.split('-')[0]
				let tab = _this.data.tab
				tab.splice(index, 1)
				_this.setData({ tab })
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	//面板
	bindPad(event) {
		if (event.detail.event == 'ok') {
			const { chord, chordInfo } = event.detail
			const { lineIdx, rowIdx } = this.data.editingItemIdx
			const param = `tab[${lineIdx}][${rowIdx}]`
			this.setData({
				[param + 'chord']: chord,
				[param + 'chordInfo']: chordInfo,
				showBtns: true
			})
			//如果有和弦图，开始绘制
			if (this.data.tab[lineIdx][rowIdx].chordInfo && this.data.tab[lineIdx][rowIdx].chordInfo.length > 0) {
				this._drawChordInfo(wx.createCanvasContext(`canvas-${lineIdx}-${rowIdx}`, this), this.data.tab[lineIdx][rowIdx].chordInfo)
			}
			if (chord !== '') {
				//最近使用和弦
				const recentChords = this.data.recentChords
				const exist = recentChords.some(item => item.chord === chord)
				if (!exist) {
					recentChords.push({ chord, chordInfo })
					this.setData({ recentChords })
					// util.cs.log(`最近和弦:${this.data.recentChords}`)
				}
			}
		}

	},

	//info
	bindInfo(event) {
		this.changed = true
		this.setData({ info: event.detail.info })
	},
})