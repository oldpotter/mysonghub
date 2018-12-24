// 云函数入口文件
const cloud = require('wx-server-sdk')
const {createWebAPIRequest} = require("../util/util")
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => new Promise((resolve, reject))