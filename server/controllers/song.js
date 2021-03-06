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
	let { uuid, song, date } = ctx.request.body
	const { songId, songName, artistName } = song
	await knex.raw("INSERT INTO `song`(`songId`, `uuid`,`songName`,`artistName`,`song`,`date`) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `song`=?,`date`=?", [songId, uuid, songName, artistName, JSON.stringify(song),date, JSON.stringify(song),date])
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
		.select('songId', 'songName', 'artistName','date')
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

async function deleteSong(ctx) {
	const { uuid, songId } = ctx.request.body
	await knex('song').where({ uuid, songId })
		.del()
		.then(count => {
			if (count > 0) {
				ctx.state = {
					code: 1985,
				}
			} else {
				throw {}
			}
		})
		.catch(err => ctx.state = {
			code: -100,
			data: err
		})

}

module.exports = {
	upload,
	getSong,
	getMySongs,
	deleteSong
}