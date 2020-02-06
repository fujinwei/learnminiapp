// 云函数入口文件
const cloud = require('wx-server-sdk'),
const tcbRouter=require('tcb-router')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app=new tcbRouter({event})

  app.use(async (ctx,next)=>{
    ctx.data={}
    ctx.data.openId=event.userInfo.openId
    await next()
  })
//此中间件只适用于“music”
  app.router('music',async(ctx,next)=>{

  })
//返回当前服务
  return app.serve();
  }
