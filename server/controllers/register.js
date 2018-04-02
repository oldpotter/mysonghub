const request = require('request-promise')
const config = require('../config.js')
const uuid = require('uuid/v1')
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: config.mysql.host,
		user: config.mysql.user,
		password: 'zhengyinyu803',
		database: ''
	}
})
module.exports = async (ctx, next) => {
	const code = ctx.request.query.code
	await knex.select().table('mysql')
		.then(res => {
			ctx.state.code = 1000
			ctx.state.data = 's'
			console.log(res)
		})
		.catch(err => {
			ctx.state.code = -1000
			ctx.state.data = err
		})


	/*
	await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`)
		.then(res => {
			
		})*/
}