Page({
	onLoad(){
		const db = wx.cloud.database()
		db.collection('songs').add({
			data: {
				song: '平凡之路'
			}
		})
		.then(res => console.log(res))
	}
})