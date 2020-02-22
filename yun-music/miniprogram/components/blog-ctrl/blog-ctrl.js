/*
author:付金伟
time:2020.2.17
function:blog控制菜单组件
*/
import formatTime from '../../utils/formatTime.js'
let userInfo = {}
const db = wx.cloud.database()
const templateId = '5LlPt7U4CNFnoje1ezPUJ9yeJcLv2LjnMdBw24ADqi8'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog:Object,//传递过来的当前列表信息的值
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, //用于授权组件的显示
    modalShow: false, //底部弹出层显示
    content: '', //评论输入内容
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    onComment() {
      
      //判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            console.log()
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //授权成功显示评论弹出层
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        },
      })
    },
    onloginsuccess(event) {
      userInfo = event.detail //预防用户授权遗漏
      //授权框消失，评论框显示，使用两个回调，做成层次返回
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },
    onloginfail() {
      wx.showModal({
        title: '授权用户才能评价',
      })
    },
    onInput(event){
      this.setData({
        content:event.detail.value
      })
    },
    //评论内容
    onSend() {
       //判断用户是否订阅推送消息
       wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success(res) {
          if (res[templateId] == 'accept') {
            wx.showToast({
              title: '订阅成功',
            })
          } else {
            wx.showToast({
              title: '订阅失败',
            })
          }
        },
        fail(err) {
          console.log(err)
        }
      })
      //插入云数据库（评论信息,用户信息，评价时间）
      let content = this.data.content //用户输入内容
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不可为空',
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask: true,
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime:db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        },
      }).then((res) => {

        //推送订阅消息
        wx.cloud.callFunction({
          name: 'tuiMessage',
          data: {
            content,
            blogId: this.properties.blogId,
            createTime:formatTime(new Date())
          }
        }).then((res) => {
          this.setData({
           content:'', //弹窗消失，清空评论框的内容
            modalShow: false,
          })
        })
        wx.hideLoading()
        wx.showToast({
        title: '评论成功',
        })
       
        console.log(content)
        //评论成功，刷新父元素页面
        this.triggerEvent('shuaxinList')
      })

    },
  },
})