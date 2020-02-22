/*
author:付金伟
time:2020.2.20
function:推送模板消息云函数
*/
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const WXContext = cloud.getWXContext()
    const result = await cloud.openapi.subscribeMessage.send({
      touser: WXContext.OPENID, //获取OPENID
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`, //用户点击会打开的界面
      lang: 'zh_CN',
      data: {
        thing3: {
          value: event.content
        },
        phrase2: {
          value: '一条新评价'
        },
        time1: {
          value: event.createTime
        }
      },
      templateId: '5LlPt7U4CNFnoje1ezPUJ9yeJcLv2LjnMdBw24ADqi8', //模板ID
      miniprogramState: 'developer'
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}