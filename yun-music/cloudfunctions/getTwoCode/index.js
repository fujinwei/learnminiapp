// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result= await cloud.openapi.wxacode.getUnlimited({
    scene:wxContext.OPENID,
    //page:"pages/playList/playList",//跳转的页面(发布后才可以)

  })
  //云函数中调用存储
  const upload=await cloud.uploadFile({
    cloudPath:'twoCode/'+Date.now()+'-'+Math.random()+'.png',//存放的名字和路径
    fileContent:result.buffer  //二进制数据
  })

  return upload.fileID
}