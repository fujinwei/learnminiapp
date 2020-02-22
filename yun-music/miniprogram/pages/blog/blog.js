// pages/blog/blog.js
let keyword='' //搜索关键字
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制底部弹出层是否显示
    modalShow: false,
    bloglists:[]//代表存放页面显示信息的数组
  },

  //发布功能的事件
  onRelease() {
    //判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },
  //授权成功，获取用户信息
  onLoginSuccess(event) {
    const detail = event.detail;
    //授权成功，跳转界面
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: "授权用户才可发布"
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  //加载blog列表
  _loadBlogList(start=0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        keyword,
        $url:'bloglist',
        start:start,//每次加载都会有一些改变，会有新的内容添加进来
        count:10,
      }
    }).then((res)=>{
      this.setData({
        bloglists:this.data.bloglists.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh() //停止刷新
    })
  },
  //搜索功能
  onSearch(event){
    //清空博客列表,搜索是从0开始的
    this.setData({
      bloglists:[]
    })
    keyword=event.detail.keyword
    this._loadBlogList(0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //先清空博客列表
    this.setData({
      bloglists:[]
    })
    this._loadBlogList(0) //从0开始，从最新的开始
  },
  //博客详情页
  gocomment(event){
    wx.navigateTo({
      url: '/pages/blog-comment/blog-comment?blogId='+event.target.dataset.blogid,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.bloglists.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    let blogdui=event.target.dataset.blog
    return {
      title:blogdui.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogdui._id}`,//转发路径
    }
  }
})