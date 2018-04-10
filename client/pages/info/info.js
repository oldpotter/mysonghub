const util = require('../../utils/util.js')
Page({
	data: {
		src: 'http://mybucket-1254336420.cossh.myqcloud.com/qrcode_gong_zhong_hao.jpg'
	},
	bind() {
		wx.downloadFile({
			url: this.data.src,
			header: {},
			success: function (res) {
				if (res.statusCode == 200) {
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function (res) {
							if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
								util.showSuccess('保存成功')
							}
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				}

			},
			fail: function (res) { },
			complete: function (res) { },
		})
		wx.saveImageToPhotosAlbum({
			filePath: '',
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		})
	}
})