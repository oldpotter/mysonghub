const request = require('request-promise')
const config = require('../config.js')
const uuidv1 = require('uuid/v1')
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.pass,
		database: 'songhub'
	}
})

/**
* {"session_key":"aELeprq7NO7eBypCjgRPLg==","expires_in":7200,"openid":"oRlcK0Q8jxrtNRJ8c9poGpUngdes"}
*/
module.exports = async (ctx, next) => {
	const code = ctx.request.query.code
	let uuid = uuidv1()
	let sessionkey
	let openid
	await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`)
		.then(res => {
			res = JSON.parse(res)
			openid = res.openid
			sessionkey = res.session_key
			return knex('user')
				.where('openid', openid)
		})
		.then(res => {
			if (res.length == 1) {
				//已存在该用户
				ctx.state.code = 1985
				ctx.state.data = res[0].uuid
				throw { reason: 'user exist' }
			} else {
				//不存在该用户
				return knex('user')
					.insert({ uuid: uuid, sessionkey: sessionkey, openid: openid })
			}
		})
		.then(() => {
			ctx.state.code = 1985
			ctx.state.data = uuid
		})
		.catch(err => {
			if (err.reason == 'user exist') {

			} else {
				ctx.state.code = -1000
				console.log('koa error:', err)
			}
		})

}