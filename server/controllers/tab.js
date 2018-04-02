const config = require('../config.js')
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: config.mysql.host,
		user: config.mysql.user,
		password: 'zhengyinyu803',
		database: 'songhub'
	}
})
async function upload(ctx) {
	let { uuid, tab } = ctx.request.body
	tab = JSON.stringify(tab)
	await knex('tab')
		.insert({ uuid, value: tab })
		.then(res => {
			ctx.state.code = 1985
		})
}
module.exports = {
	upload
}