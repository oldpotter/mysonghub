App({
	onLaunch: function () {
		Promise.prototype.finally = function (callback) {
			let P = this.constructor;
			return this.then(
				value => P.resolve(callback()).then(() => value),
				reason => P.resolve(callback()).then(() => { throw reason })
			);
		}
		this.songs = wx.getStorageSync('songs') || []
	},
	songs: undefined,
})