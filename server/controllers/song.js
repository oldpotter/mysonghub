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
	const { songId, songName, artistName } = song
	await knex.raw("INSERT INTO `song`(`songId`, `uuid`,`songName`,`artistName`,`song`) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE `song`=?", [songId, uuid, songName, artistName, JSON.stringify(song), JSON.stringify(song)])
		.then(res => {
			ctx.state.code = 1985
		})
		.catch(err => {
			ctx.state.code = -100
			ctx.state.data = err
		})
}

async function getMySongs(ctx) {
	const uuid = ctx.request.query.uuid
	await knex('song')
		.select('songId', 'songName', 'artistName')
		.where({ uuid })
		.then(res => ctx.state = {
			code: 1985,
			data: res
		})
		.catch(err => ctx.state = {
			code: -100,
			data: err
		})
}

async function getSong(ctx) {
	const songId = ctx.request.query.songId
	await knex('song').where({ songId })
		.then(res => {
			ctx.state = {
				code: 1985,
				data: res[0]
			}
		})
		.catch(err => console.error('错误', err))
}

module.exports = {
	upload,
	getSong,
	getMySongs
}