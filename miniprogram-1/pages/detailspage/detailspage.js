// pages/detailspage/detailspage.js
var newlistDB=require("/../database/newlistDB.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载————————————接受传过来的ID
   */
  onLoad: function (options) {
    var postId = options.id; /*获取传过来的ID，如果使用的是id，则使用id，自定义什么就是用什么 */
    var poData = newlistDB.newslist[postId];//因为在定义数据文件的时候，定义了一个数组，所以数组文件最下方的newslist才是数组名，而newlistDB却是接受响应文件
  //数据绑定,将数据文件中的信息绑定到该页。
    this.setData({
      postData:poData
    });
    /*this.setData.contentimg = postData.contentimg;
    this.setData.face = postData.face;
    this.setData.author = postData.author;
    this.setData.dateTime = postData.dateTime;
    this.setData.title = postData.title;
    this.setData.detail = postData.detail;*/


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