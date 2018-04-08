const config = require('../config.js')

/**
 * 网络请求
 */
function pRequest(url, data, method = 'GET', header = {}, dataType = 'json') {
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			header: header,
			method: method,
			dataType: dataType,
			success: function (res) {
				resolve(res)
			},
			fail: function (res) {
				reject(res)
			},
		})
	})
}

//获取uuid
function getUUID() {
	return new Promise((resolve, reject) => {
		let uuid = wx.getStorageSync('uuid')
		if (uuid) {
			resolve(uuid)
		} else {
			wx.login({
				success: function (res) {
					wx.request({
						url: `${config.service.registerUrl}${res.code}`,
						data: '',
						header: {},
						method: 'GET',
						dataType: 'json',
						responseType: 'text',
						success: function (res) {
							if (res.data.code != 1985) {
								console.error(res)
								reject()
								return
							}
							wx.setStorageSync('uuid', res.data.data)
							resolve(res.data.data)
						},
						fail: function (res) {
							console.error(res)
						},
						complete: function (res) { },
					})
				},
				fail: function (res) { },
				complete: function (res) { },
			})
		}
	})
}

module.exports = {
	pRequest,
	getUUID,
}