/*
author:付金伟
time:2020.2.5
function:y用于读取歌单数据
*/

// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter=require('tcb-router')
const rp=require('request-promise')

var URL = 'http://musicapi.xiecheng.live'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //读取数据库歌单数据，并排序
  const app=new tcbRouter({event})

  app.router('playlist',async(ctx,next)=>{
    ctx.body= await cloud.database().collection('playlistDB')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc').get()
    .then((res)=>{
      return res
    })
  })

  app.router('musiclist',async(ctx,next)=>{
      ctx.body=await rp(URL+'/playlist/detail?id='+parseInt(event.playlistId))
      .then((res)=>{
        return JSON.parse(res)
      })
  })
  return app.serve();
}