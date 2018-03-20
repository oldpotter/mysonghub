Page({
	data:{
		arr:[]
	},
	onReady(){
		const arr = this.data.arr
		for(let i=0;i<100;i++){
			arr.push('yyyyyyyyyyyyyyyyyyyyy')
		}
		this.setData({arr})
	},
	blue(){
		console.log('blue')
	},
	yellow() {
		console.log('yellow')
	},
	red() {
		console.log('red')
	},
	cs(){
		console.log('cs')
	}
})