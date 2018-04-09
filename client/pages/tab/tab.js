const app = getApp()
const config = require('../../config.js')
const promise = require('../../utils/promise.js')
const util = require('../../utils/util.js')
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

	data: {
		fontSize: 1,
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
				idx: 2,
				title: '编辑',
				on: false,
				src: '../../resources/edit.png',
				srcOn: '../../resources/edit_on.png',

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
				idx: 4,
				title: '上传',
				on: false,
				src: '../../resources/upload.png',
				srcOn: '../../resources/upload_on.png',
				autoOff: true
			},
			{
				idx: 5,
				title: '屏幕',
				on: false,
				src: '../../resources/screen.png',
				srcOn: '../../resources/screen_on.png',
			},
			{
				idx: 6,
				title: '字体',
				on: false,
				src: '../../resources/font.png',
				srcOn: '../../resources/font_on.png',
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
	},

	onLoad(options) {
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
			})
			.catch(() => util.showError())
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
		const _this = this
		const idx = event.detail.idx
		switch (idx) {
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
				const _this = this
				promise.getUUID()
					.then(uuid => promise.pRequest(config.service.uploadSongUrl, {
						uuid, song: {
							tab: this.data.tab,
							info: this.data.info,
							songId: this.item.songId,
							songName: this.item.songName,
							artistName: this.item.artistName,
						}
					}, 'POST'))
					.then(res => {
						if (res.data.code != 1985) throw ''
						util.showSuccess('上传成功')
					})

				break
			}
			//常亮
			case 5: {
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