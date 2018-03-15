const app = getApp()
Page({
	scrollTop: 0,//页面滚动距离px
	scrollTo: 0,//要滚到的距离
	scrollInterval: undefined,
	data: {
		tab: undefined,
		showPad: false,//和弦面板
		showScrollPad: false,//调速面板
		isScrolling:false,
		chord: '',
		param: '',
		recentChords: [],
		isEditing: false,//处于编辑模式
		showButtons: false,//显示底部按钮们
		items: [
			{
				idx: 1,
				title: '滚屏',
				on: false,
				src: '../../resources/run.png'
			},
			{
				idx: 1,
				title: '编辑',
				on: false,
				src: '../../resources/edit.png'
			},
		]
	},

	onLoad(options) {
		this.index = options.index
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
				if(!showScrollPad){
					clearInterval(this.scrollInterval)
				}
			}
		}
	},

	//scroll pad
	bindScrollPad(event) {
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