Page({
	onLoad(){
		wx.cloud.callFunction({
			name: 'search_song',
			data: {
				keywards: '朴树'
			},
		})
		.then(res=>{
			console.log('res:', res)
		})
		.catch(console.error)
	}
})