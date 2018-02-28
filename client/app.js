App({
	onLaunch: function () {
		this.songs = wx.getStorageSync('songs')||[]
		console.log(this.songs)
	},
	songs: undefined,
})