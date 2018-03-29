const request = require('request-promise')
const config = require('../config.js')
const exec = require('child_process').exec
const shell = require('shelljs')

module.exports = async (ctx, next) => {
	const code = ctx.request.query.code
	ctx.state.code = 1000
	ctx.state.data = shell.exec('head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 168', { silent: true }).stdout;
	/*
	await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`)
		.then(res => {
			
		})*/
}