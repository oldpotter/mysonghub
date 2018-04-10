const app = getApp()
const promise = require('../../utils/promise.js')
const config = require('../../config.js')
const util = require('../../utils/util.js')
Page({
	data: {
		songs: undefined,
		items: [
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
				contact: true,
			},
			{
				idx: 3,
				title: '公众号',
				on: false,
				src: '../../resources/gzh.png',
				srcOn: '../../resources/gzh.png',
			},
		]
	},
	onPullDownRefresh() {
		this._refreshData()
	},
	onShow() {
		this._refreshData()
	},

	_refreshData() {
		promise.getUUID()
			.then(uuid => promise.pRequest(`${config.service.getMySongsUrl}?uuid=${uuid}`))
			.then(res => {
				if (res.data.code != 1985) throw {}
				this.setData({ songs: res.data.data })
				// console.log(this.data.songs)
			})
			.catch(err => {
				console.error('error:', err)
				util.showError()
			})
			.finally(() => {
				wx.stopPullDownRefresh()
			})
	},

	onClickSong(event) {
		const songId = event.currentTarget.dataset.songId
		wx.navigateTo({
			url: `../tab/tab?songId=${songId}`,
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	onClickKLButtons(event) {
		const idx = event.detail.idx
		switch (idx) {
			// //编辑
			// case 0: {
			// 	this.setData({ isEditing: !this.data.isEditing })
			// 	break
			// }
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
			//公众号
			case 3:{
				wx.navigateTo({
					url: '../info/info',
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			}

		}
	},

})