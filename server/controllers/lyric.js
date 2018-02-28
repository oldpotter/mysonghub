const { createWebAPIRequest } = require("../util/util")
module.exports = async (ctx, next) => {
	const req = ctx.request
	const cookie = req.get('Cookie') ? req.get('Cookie') : ''
	const data = {}
	const id = req.query.id
	await createWebAPIRequest(
		'music.163.com',
		'/weapi/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1',
		'POST',
		data,
		cookie
	)
		.then(res => ctx.state.data = res)
		.catch(() => ctx.state.code = -1)
}