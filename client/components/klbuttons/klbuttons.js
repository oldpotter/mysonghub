Component({
	properties: {
		/**
		 * idx:Number 序号
		 * title:String 名称
		 * on:Boolean 是否开启
		 * src:String 关闭图片 
		 * srcOn:String 开启图片
		 * autoOff:Boolean 是否自动关闭
		 * disable:Boolean是否可用
		 * contact:Boolean是否是客服按钮
		 * isShare:Boolean是否是分享按钮
		 */
		items: Array,
		hidden: Boolean
	},

	methods: {
		tap(event) {
			const index = event.currentTarget.dataset.index
			if (this.data.items[index].disable) {
				return
			}
			const param = `items[${index}].on`
			this.setData({
				[param]: !this.data.items[index].on
			})
			if (this.data.items[index].autoOff && this.data.items[index].on) {
				setTimeout(() => this.setData({
					[param]: false
				}), 1000)
			}
			this.triggerEvent('ontap', { idx: this.data.items[index].idx }, {})
		}
	}
})