App({
	onLaunch: function () {
		this.setup = wx.getStorageSync('setup') || {}

		Promise.prototype.finally = function (callback) {
			let P = this.constructor;
			return this.then(
				value => P.resolve(callback()).then(() => value),
				reason => P.resolve(callback()).then(() => { throw reason })
			);
		}

		wx.cloud.init({
			traceUser: true,
			env: 'test-24bda5'
		})
	},

	/**
	 * screenOn:Boolean屏幕常亮
	 * fontSize:Number字体大小
	 * scrollSpeed:Number滚屏速度
	 * guitarMode:Boolean吉他谱模式
	 */
	setup: undefined
})