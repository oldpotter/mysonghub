const util = require('../../utils/util.js')
const config = require('../../config.js')
Page({
	onLoad(){
		// util.cs.error('sad')
		util.cs.log(config.service.searchUrl)
	}
})