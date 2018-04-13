Page({
	data: {
		indexs: [0, 1],
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
		]
		/*
		items: [
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
		],
		index: 0,*/
	},

	bindChange(e) {
		const indexs = e.detail.value
		this.setData({indexs})
	},

})