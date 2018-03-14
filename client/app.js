App({
	onLaunch: function () {
		this.songs = wx.getStorageSync('songs')||[]
	},
	songs: undefined,
})