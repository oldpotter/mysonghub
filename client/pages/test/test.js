const config = require('../../config.js')
const promise = require('../../utils/promise.js')
Page({
	onLoad() {
		promise.getUUID()
			.then(uuid => {
				wx.request({
					url: `${config.service.uploadSongUrl}`,
					data: {
						uuid,
						song: { song: 'ahah', songId: '11111222' }
					},
					header: {},
					method: 'POST',
					dataType: 'json',
					responseType: 'text',
					success: function (res) {
						console.log(res)
					},
					fail: function (res) { },
					complete: function (res) { },
				})
			})

	}
})