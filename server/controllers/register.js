const request = require('request-promise')
const config = require('../config.js')
const uuid = require('uuid/v1')
module.exports = async (ctx, next) => {
	const code = ctx.request.query.code
	ctx.state.code = 1000
	ctx.state.data = uuid()
	/*
	await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`)
		.then(res => {
			
		})*/
}