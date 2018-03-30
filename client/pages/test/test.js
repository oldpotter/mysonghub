const config = require('../../config.js')
Page({
	onLoad(){
		wx.request({
			url: `${config.service.registerUrl}`,
			data: '',
			header: {},
			method: 'GET',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				console.log(res)
			},
			fail: function(res) {},
			complete: function(res) {},
		})
	}
})