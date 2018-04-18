Page({
	data: { show: true },
	tap(){
		this.setData({show:!this.data.show})
		console.log(this.data.show)
	}
})