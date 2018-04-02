const request = require('request-promise')
const config = require('../config.js')
const uuidv1 = require('uuid/v1')
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: config.mysql.host,
		user: config.mysql.user,
		password: 'zhengyinyu803',
		database: 'songhub'
	}
})

/**
* {"session_key":"aELeprq7NO7eBypCjgRPLg==","expires_in":7200,"openid":"oRlcK0Q8jxrtNRJ8c9poGpUngdes"}
*/
module.exports = async (ctx, next) => {
	const code = ctx.request.query.code
	let uuid = uuidv1()
	await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`)
		.then(res => {
			return knex('user')
				.insert({ uuid: uuid, value: res })
		})
		.then(res => {
			ctx.state.code = 1985
			ctx.state.data = uuid
		})
		.catch(err => {
			ctx.state.code = -1000
			ctx.state.data = err
		})
}