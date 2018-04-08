// pages/tab/components/font.js
Component({
  /**
   * 组件的属性列表
   */
	properties: {
		hidden:Boolean
	},

  /**
   * 组件的初始数据
   */
	data: {

	},

  /**
   * 组件的方法列表
   */
	methods: {
		tap(event) {
			this.triggerEvent('font', { value: event.currentTarget.dataset.value }, {})
		}
	}
})
