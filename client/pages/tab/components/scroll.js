Component({
	properties: {
		isPlaying: Boolean,
		hidden: {
			type:Boolean,
			observer:('_hidden')
		},
		
		value:{
			type:Number,
			value:38,
		}
	},

	data: {
		value: 0
	},

	methods: {
		_hidden(){
			this.setData({isPlaying:false})
		},

		onChanging(event) {
			this.setData({
				value: event.detail.value
			})
			wx.showToast({
				title: event.detail.value + '',
				icon: 'success',
				image: '',
				duration: 200,
				mask: true,
				success: function (res) { },
				fail: function (res) { },
				complete: function (res) { },
			})
		},

		onTap() {
			const isPlaying = !this.data.isPlaying
			this.setData({ isPlaying })
			this.triggerEvent('play', {
				isPlaying: this.data.isPlaying,
				value: this.data.value
			})
		},
	}
})