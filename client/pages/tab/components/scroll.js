Component({
	properties: {
		hidden: Boolean,
		isPlaying: Boolean,
	},

	data: {
		value: 0
	},

	methods: {
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