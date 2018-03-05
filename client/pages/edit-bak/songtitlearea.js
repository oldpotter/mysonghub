// pages/edit/songtitlearea.js
Component({
  /**
   * 组件的属性列表
   */
	properties: {
		key: {
			type: String,
			value: 'C',
			observer: '_valueChanged'
		},
		playKey: {
			type: String,
			value: '',
			observer: '_valueChanged'
		},
		capo: {
			type: Number,
			value: 0,
			observer: '_valueChanged'
		},
		tempo: {
			type: Number,
			value: 0,
			observer: '_valueChanged'
		}
	},

  /**
   * 组件的初始数据
   */
	data: {
		isEditing: false,
		isExpand: false
	},

  /**
   * 组件的方法列表
   */
	methods: {
		_onClickArrow() {
			const isExpand = !this.data.isExpand
			this.setData({ isExpand })
		},

		_onClickEdit() {
			const isEditing = true
			this.setData({ isEditing })
		},

		_onSave(event) {
			const isEditing = false
			this.setData({ isEditing })
			this.triggerEvent('onsonginfosaved',event.detail.value,{})
		}
	}
})
