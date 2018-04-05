const config = require('../config.js')
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.pass,
		database: 'songhub'
	}
})

async function upload(ctx) {
	let { uuid, song } = ctx.request.body
	await knex.raw("INSERT INTO `song`(`songId`, `uuid`, `song`) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `song`=?", [song.songId, uuid, JSON.stringify(song), JSON.stringify(song)])
		.then(res => {
			ctx.state.code = 1200
			// ctx.state.data =
		})
}
module.exports = {
	upload
}