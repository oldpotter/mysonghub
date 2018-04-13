const util = require('../../../utils/util.js')
Component({
	properties: {
		isEditing: Boolean,
		/**
		 * title:String
		 * value:String
		 */
		info: Array,
	},
	data: {
		indexs: [0, 0],
		items: [
			[
				{
					key: '0',
					value: ' '
				},
				{
					key: '1',
					value: 'b'
				},
				{
					key: '0',
					value: '#'
				},
			],
			[
				{
					key: '0',
					value: 'C'
				},
				{
					key: '1',
					value: 'D'
				},
				{
					key: '2',
					value: 'E'
				},
				{
					key: '3',
					value: 'F'
				},
				{
					key: '4',
					value: 'G'
				},
				{
					key: '5',
					value: 'A'
				},
				{
					key: '6',
					value: 'B'
				},
			],
		],
		nums:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
	},

	ready() {
	},

	methods: {
		bindChange(e) {
			util.cs.log(e)
			const index = e.currentTarget.dataset.index
			const arr = e.detail.value
			let value
			if (index != 2) {
				value = this.data.items[0][arr[0]].value + this.data.items[1][arr[1]].value
			}else{
				value = e.detail.value
			}
			const params = `info[${index}].value`
			this.setData({
				[params]: value
			})
			this.triggerEvent('info', { info: this.data.info }, {})
			util.cs.log(this.data.info)
		},
	}
})