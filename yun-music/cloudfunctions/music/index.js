/*
author:付金伟
time:2020.2.5
function:y用于读取歌单数据
*/

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //读取数据库歌单数据，并排序
  return await cloud.database().collection('playlistDB')
  .skip(event.start)
  .limit(event.count)
  .orderBy('createTime','desc').get()
  .then((res)=>{
    return res
  })
}