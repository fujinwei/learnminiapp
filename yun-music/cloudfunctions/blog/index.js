// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogDB = db.collection('blog')
const commentDB=db.collection('blog-comment')

const MAX_list = 100 //每次查询最大条数

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  //获取博客列表信息
  app.router('bloglist', async (ctx, next) => {
    //先判断关键字是否存在
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') {
      w = {
        content: new db.RegExp({
          regexp: keyword,
          options: 'i' //i  忽略大小写   m  跨行搜索
        })
      }
    }

    //skip分行  limit每次查询条数
    let blogList = await blogDB.where(w).skip(event.start).limit(event.count).orderBy('createTime', 'desc')
      .get().then((res) => {
        return res.data
      })
    ctx.body = blogList
  })
//博客正文显示
  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    //博客详情信息查询
    let detail = await blogDB.where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })
    //评论查询
    const countResult =await commentDB.count()
    const total = countResult.total //评论结果
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_list) //查询次数
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = commentDB.skip(i * MAX_list).limit(MAX_list).where({
          blogId
        }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => { //累加器进行结果累加
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }

    }
    //返回前端
    ctx.body = {
      commentList,
      detail,
    }

  })

  return app.serve()
}