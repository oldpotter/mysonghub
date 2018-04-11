const app = getApp()
const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showLoading({
	title: text || '请稍后',
})

// 显示成功提示
const showSuccess = text => wx.showToast({
	title: text,
	icon: 'success'
})

const showModel = (title, content) => {
	wx.hideToast();
	wx.showModal({
		title,
		content: JSON.stringify(content),
		showCancel: false
	})
}
const showError = title => wx.showToast({
	title: title || '出错啦',
	image: '../../resources/error.png',
})

const cs = app.debug ? console : {
	log() { },
	error(){}
}

module.exports = { formatTime, showBusy, showSuccess, showModel, showError, cs }
