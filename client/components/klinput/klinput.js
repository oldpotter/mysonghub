Component({
	properties: {
		title: String,
		hidden: {
			type: Boolean,
			observer: '_showOrHidden'
		}
	},

	data: {
		text: ''
	},

	methods: {
		_showOrHidden(newValue, oldValue) {
			this.setData({
				hidden: newValue,
				text:''
			})
		},

		onClickCancel() {
			this.triggerEvent('onclickcancel', {}, {})
		},
		onClickConfirm(event) {
			this.triggerEvent('onclickconfirm', { value: this.data.text }, {})
		},

		onBlur(event) {
			this.setData({ text: event.detail.value })
		},
	}
})