const { createWebAPIRequest } = require("../util/util")
module.exports = async (ctx, next) => {
	const req = ctx.request
	const cookie = req.get("Cookie") ? req.get("Cookie") : "";
	const keywords = req.query.keywords;
	const type = req.query.type || 1;
	const limit = req.query.limit || 30;
	const offset = req.query.offset || 0;
	// *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
	const data = {
		csrf_token: "",
		limit,
		type,
		s: keywords,
		offset
	};

	await createWebAPIRequest(
		"music.163.com",
		"/weapi/search/get",
		"POST",
		data,
		cookie
	)
		.then(res => ctx.state.data = res)
		.catch(() => ctx.state.code = -1)
}
