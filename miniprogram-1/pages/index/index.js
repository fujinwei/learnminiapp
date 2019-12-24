// pages/index/index.js
// 接引JS的数据元素文件
var newsData=require("../database/newlistDB.js") 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ post_key:newsData.newslist})  /*将数组元素变为一个对象 */
    /*post_key和前边view的wx:for中的内容关键字是一个；
      newsData为接引引用的定义关键字；
      newslist为数据元素出口接引数据元素的定义的值
     */
  },
  //响应点击事件 在包含着template的view中引用，使用catchtab
  listItem:function(event){
    var postId=event.currentTarget.dataset.postid;//获取点击事件的ID,即点击了哪一个事件
    wx:wx.navigateTo({   //跳转命令
      url: '../detailspage/detailspage?id=' + postId, //id写法是属于自定义的，自己写什么都可以的 
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
      
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})