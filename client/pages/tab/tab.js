const app = getApp()
const config = require('../../config.js')
const promise = require('../../utils/promise.js')
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
	screenOn: false,//屏幕常亮
	index: undefined,//app.songs[index]

	data: {
		fontSize: 5,
		tab: undefined,
		showPad: false,//是否显示和弦面板
		showScrollPad: false,//是否显示调速面板
		showInfo: false,//显示信息
		tips: `编辑模式下：
		1、长按删除一行。
		2、点击单字添加和弦。`,//帮助
		isEditing: false,//是否处于编辑模式
		info: undefined,//谱子信息
		chord: '',
		param: '',
		recentChords: [],
		showButtons: false,//显示底部按钮们
		items: [
			{
				idx: 1,
				title: '滚屏',
				on: false,
				src: '../../resources/run.png',
				srcOn: '../../resources/run_on.png'
			},
			{
				idx: 1,
				title: '编辑',
				on: false,
				src: '../../resources/edit.png',
				srcOn: '../../resources/edit_on.png',

			},
			{
				idx: 2,
				title: '帮助',
				on: false,
				src: '../../resources/tip.png',
				srcOn: '../../resources/tip_on.png',
				autoOff: true
			},
			{
				idx: 3,
				title: '上传',
				on: false,
				src: '../../resources/upload.png',
				srcOn: '../../resources/upload_on.png',
				autoOff: true
			},
			{
				idx: 4,
				title: '屏幕',
				on: false,
				src: '../../resources/screen.png',
				srcOn: '../../resources/screen_on.png',
			},
			{
				idx: 5,
				title: '字体',
				on: false,
				src: '../../resources/font.png',
				srcOn: '../../resources/font_on.png',
			},
		]
	},

	onLoad(options) {
		this.index = options.index || app.songs.length - 1
		this.setData({
			tab: app.songs[this.index].tab,
			info: app.songs[this.index].info ? app.songs[this.index].info : [
				{ title: 'Key', value: '' },
				{ title: 'Play', value: '' },
				{ title: 'Capo', value: '' },
			]
		})
	},

	onUnload() {
		wx.setStorage({
			key: 'songs',
			data: app.songs,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	onPageScroll(event) {
		this.scrollTop = event.scrollTop
		// if (this.scrollTop != this.scrollTo) {
		// 	console.log('onPageScroll-auto stop')
		// 	clearInterval(this.scrollInterval)
		// }
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

	//点击功能按钮
	onClickKLButtons(event) {
		const index = event.detail.index
		switch (index) {
			//滚屏
			case 0: {
				const showScrollPad = !this.data.showScrollPad
				this.setData({ showScrollPad })
				if (!showScrollPad) {
					clearInterval(this.scrollInterval)
				}
				break
			}
			//编辑
			case 1: {
				this.setData({ isEditing: !this.data.isEditing })
				if (!this.data.isEditing) {
					this.setData({ showPad: false })
				}
				break
			}
			//提示
			case 2: {
				this.setData({ showInfo: !this.data.showInfo })
				setTimeout(() => this.setData({ showInfo: !this.data.showInfo }), 3000)
				break
			}
			//上传
			case 3: {
				const _this = this
				wx.showLoading({
					title: '',
					mask: true,
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
				promise.getUUID()
					.then(uuid => {
						wx.request({
							url: `${config.service.uploadSongUrl}`,
							data: {
								uuid, song: app.songs[this.index]
							},
							header: {},
							method: 'POST',
							dataType: 'json',
							responseType: 'text',
							success: function (res) {
								if (res.data.code = 1985) {
									console.log(res)
									wx.showToast({
										title: '上传成功',
										icon: 'success',
										image: '',
										duration: 2000,
										mask: true,
										success: function (res) { },
										fail: function (res) { },
										complete: function (res) { },
									})
								}
							},
							fail: function (res) { },
							complete: function (res) { },
						})
					})
					.catch(err => console.error(err))
				break
			}
			//常亮
			case 4: {
				this.screenOn = !this.screenOn
				wx.setKeepScreenOn({
					keepScreenOn: this.screenOn,
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
				break
			}
			//字体
			case 5: {

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
					wx.pageScrollTo({
						scrollTop: this.scrollTo,
						duration: 200,
					})
				}, 1000)
			} else {
				// 停止滚屏
				clearInterval(this.scrollInterval)
			}
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
		const param = `tab[${lineIdx}][${rowIdx}].chord`
		this.setData({
			showPad: true,
			chord: this.data.tab[lineIdx][rowIdx].chord,
			param
		})
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
	},

	//info
	bindInfo(event) {
		this.setData({ info: event.detail.info })
	},
})