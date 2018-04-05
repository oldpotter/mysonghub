const app = getApp()
Page({
	data: {
		isEditing: false,
		songs: undefined,
		items: [
			{
				idx: 1,
				title: '编辑',
				on: false,
				src: '../../resources/edit.png',
				srcOn: '../../resources/edit_on.png'
			},
			{
				idx: 1,
				title: '搜歌词',
				on: false,
				src: '../../resources/search.png',
				srcOn: '../../resources/search_on.png',
				autoOff: true
			},
			{
				idx: 2,
				title: '提意见',
				on: false,
				src: '../../resources/contact.png',
				// srcOn: '../../resources/cont.png',
				autoOff: true,
				contact:true,
			},
		]
	},

	onShow() {
		this.setData({ songs: app.songs })
	},

	onClickSong(event) {
		// console.log(event)
		const index = event.currentTarget.dataset.index
		wx.navigateTo({
			url: `../tab/tab?index=${index}&songId=${app.songs[index].songId}`,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},


	onClickKLButtons(event) {
		const index = event.detail.index
		switch (index) {
			//编辑
			case 0: {
				this.setData({ isEditing: !this.data.isEditing })
				break
			}
			//搜歌词
			case 1: {
				wx.navigateTo({
					url: '../search/search',
					success: function (res) { },
					fail: function (res) { },
					complete: function (res) { },
				})
				break
			}

		}
	},
	onClickDelete(event) {
		const index = event.currentTarget.dataset.index
		const songs = app.songs
		songs.splice(index, 1)
		this.setData({ songs })
		app.songs = songs
		wx.setStorageSync('songs', songs)
	},
})