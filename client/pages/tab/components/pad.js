// pages/edit/pad.js
const util = require('../../../utils/util.js')
Component({

	properties: {
		show: Boolean,
		chord: String,
		recentItems: Array,
		/**
		 * 和弦信息数据
		 * 0 ~ 5,
		 *  type:number 
		 * 	value:1)空弦o 0)未标注 -1)制弦x
		 * 31,
		 * 	type:number
		 * 	value:any number
		 * 6 ~ 30,
		 *  type:bool
		 * 	value:true)按弦 false)空
		 * 
		 */
		chordInfo: Array,
	},

	data: {
		top: 20,//距离上面距离
		left: 10,//距离左边距离
		//和弦品格尺寸
		h: 60,//60*5
		w: 40,//40*6
		x: 0,
		y: 0,
		arrPionts: [],//坐标信息
		showChordPad: false,//是否显示和弦面板图
		range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		items: [
			{
				idx: 0, item: [
					'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'
				]
			},
			{
				idx: 1, item: [
					'm', '#', 'b', 'add', 'sus', 'maj', 'min', '+', '-', '/',
					'1', '2', '3', '4', '5', '6', '7', '9', '11', '13'
				]
			},]
	},

	methods: {
		_initData() {
			if (this.data.chordInfo.length > 0) return
			const chordInfo = []
			for (let i = 0; i < 31; i++) {
				if (i <= 5) {
					chordInfo.push(0)
					continue
				} else if (i == 30) {
					chordInfo.push(1)
				} else {
					chordInfo.push(false)
				}
			}
			this.setData({ chordInfo })

		},
		//点击和弦item
		onClickItem(event) {
			const position = event.currentTarget.dataset.position
			const value = this.data.items[position.split('-')[0]].item[position.split('-')[1]]
			let chord = this.data.chord
			chord = chord + value
			this.setData({ chord })
		},

		//点击ok按钮
		onClickOKBtn() {
			this.setData({
				show: false
			})
			this.triggerEvent('pad', { event: 'ok', value: this.data.chord }, {})
		},

		//点击删除按钮
		onClickDelBtn() {
			this.setData({ chord: '' })
		},

		//点击和弦图按钮
		onClickChordMapBtn() {
			this._initData()
			this.setData({ showChordPad: true })
			const ctx = wx.createCanvasContext('myCanvas', this)
			const h = this.data.h
			const w = this.data.w
			this._drawBoard(ctx, w, h)
			this._drawChord(ctx, w, h)
			ctx.draw()
		},

		//画指板
		_drawBoard(ctx, w, h) {
			ctx.setStrokeStyle('Black')
			//竖线
			for (let i = 0; i < 6; i++) {
				ctx.moveTo(this.data.left + i * w, this.data.top)
				ctx.lineTo(this.data.left + i * w, this.data.top + h * 4)
			}
			ctx.stroke()
			//横线
			ctx.setStrokeStyle('DarkGray')
			for (let i = 0; i < 5; i++) {
				ctx.moveTo(this.data.left, this.data.top + h * i)
				ctx.lineTo(this.data.left + w * 5, this.data.top + h * i)
			}
			ctx.stroke()
		},

		//画其它
		_drawChord(ctx, w, h) {
			const arrPoints = []
			this.data.chordInfo.forEach((value, i) => {
				if (i == 30) return
				let a, b
				if (i <= 5) {
					// util.cs.log('xxxxxx', this.data.left)
					a = this.data.left + i * w
					b = this.data.top - 5
					if (value != 0) {
						ctx.beginPath()
						ctx.setFontSize(14)
						ctx.setTextAlign('center')
						ctx.fillText(value == 1 ? 'o' : 'x', a, b)
					}
				} else {
					i = i - 6
					a = this.data.left + i % 6 * w
					b = this.data.top + parseInt(i / 6) * h + h / 2
					if (value) {
						ctx.beginPath()
						ctx.arc(a, b, 5, 0, 2 * Math.PI)
						ctx.setFillStyle('Black')
						ctx.fill()
					}
				}
				arrPoints.push({ a, b })
			})
			if (this.data.arrPionts.length == 0) {
				this.setData({ arrPoints })
			}
		},

		start: function (e) {
			this.setData({
				x: e.touches[0].x,
				y: e.touches[0].y
			})
		},
		move: function (e) {
			this.setData({
				x: e.touches[0].x,
				y: e.touches[0].y
			})
		},
		end: function (e) {
			// util.cs.log(`arrPoints:${this.data.arrPoints}`)
			// util.cs.log(`x:${this.data.x},y:${this.data.y}`)
			const x = this.data.x
			const y = this.data.y
			let minimum = 99999
			let idx
			this.data.arrPoints.map((item, i) => {
				// util.cs.log(i)
				return { num: Math.abs(item.a - x) * Math.abs(item.b - y), i }
			}).forEach(item => {
				// util.cs.log(item.num)
				if (item.num < minimum) {
					idx = item.i
					minimum = item.num
				}
			})
			// util.cs.log(`idx:${idx},minimum:${minimum}`)
			const param = `chordInfo[${idx}]`
			let value = this.data.chordInfo[idx]
			if (idx <= 5) {
				switch (value) {
					case 1:
						value = -1
						break
					case 0:
						value = 1
						break
					case -1:
						value = 0
						break
				}
			} else {
				value = !value
			}
			this.setData({
				[param]: value
			})

			const ctx = wx.createCanvasContext('myCanvas', this)
			const h = this.data.h
			const w = this.data.w
			this._drawBoard(ctx, w, h)
			this._drawChord(ctx, w, h)
			ctx.draw()
		},

		onPickerChange(e) {
			const param = `chordInfo[30]`
			this.setData({
				[param]: e.detail.value
			})
		},

		//确定和弦图
		onClickOKFret() {
			this.setData({ showChordPad: false })
			this.triggerEvent('pad', { event: 'chordInfo', chordInfo: this.data.chordInfo }, {})
		},

		//清空和弦图
		onClickClearFret() {
			this.setData({ chordInfo: [] })
			this._initData()
			const ctx = wx.createCanvasContext('myCanvas', this)
			const h = this.data.h
			const w = this.data.w
			this._drawBoard(ctx, w, h)
			this._drawChord(ctx, w, h)
			ctx.draw()
		},
	}
})
