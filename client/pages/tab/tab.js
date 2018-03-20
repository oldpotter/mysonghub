const app = getApp()
Page({
	scrollTop: 0,//页面滚动距离px
	scrollTo: 0,//要滚到的距离
	scrollInterval: undefined,
	data: {
		tab: undefined,
		showPad: false,//是否显示和弦面板
		showScrollPad: false,//是否显示调速面板
		showInfo:false,//显示信息
		tips:`编辑模式下：
		1、长按删除一行。
		2、点击单字添加和弦。`,//帮助
		isEditing: false,//是否处于编辑模式
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
				srcOn:'../../resources/run_on.png'
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
				srcOn: '../../resources/tip_on.png'
			},
		]
	},

	onLoad(options) {
		this.index = options.index || app.songs.length - 1
		this.setData({
			tab: app.songs[this.index].tab
		})
	},

	onUnload() {
		app.songs[this.index].tab = this.data.tab
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
				if(!this.data.isEditing){
					this.setData({showPad:false})
				}
				break
			}
			//提示
			case 2: {
				this.setData({showInfo:!this.data.showInfo})
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
						duration: 1000,
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
				_this.setData({tab})
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
	}
})