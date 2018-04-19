Page({
	onLoad(){
		const ctx = wx.createCanvasContext('canvas', this)
		ctx.fillRect(10,10,30,30)
		ctx.draw()
	}
})