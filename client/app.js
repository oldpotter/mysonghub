App({
	//调试
	debug: true,

	onLaunch: function () {
		this.setup = wx.getStorageSync('setup') || {}

		Promise.prototype.finally = function (callback) {
			let P = this.constructor;
			return this.then(
				value => P.resolve(callback()).then(() => value),
				reason => P.resolve(callback()).then(() => { throw reason })
			);
		}
	},

	/**
	 * screenOn:Boolean屏幕常亮
	 * fontSize:Number字体大小
	 * scrollSpeed:Number滚屏速度
	 */
	setup: undefined
})