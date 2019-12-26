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

   this.data.currentPostId= postId;//将currentPostId的一个属性赋值给data,不能直接将ID送给data

    var poData = newlistDB.newslist[postId];//因为在定义数据文件的时候，定义了一个数组，所以数组文件最下方的newslist才是数组名，而newlistDB却是接受响应文件
  //数据绑定,将数据文件中的信息绑定到该页。
    this.setData({
      postData:poData
    });


    //获取所有缓存文件的内容
    var bothCollected = wx.getStorageSync('both_Collected');//both_Collected表示一个键
    //通过IP来分辨缓冲的内容
    if (bothCollected) {//当bothCollected为真，缓存存在
      //判断缓存数据是否存在，存在的话，根据前台的if语句，这里显示未收藏的内容
      var bocollected = bothCollected[postId];

      if (bocollected){
        this.setData({
          //绑定数据college，使得前端可以显示，前端也进行了绑定。
          collected: bocollected
        })
      }
    }
    else{
      var bothCollected={};
       //由于整个缓存记录都不存在，所以给他一个false
      bothCollected[postId]=false;
      wx.setStorageSync('both_Collected', bothCollected)
    }
  },
//点击事件onCollected
  onCollected:function(event){
    //获取他的键值
    var bothCollected = wx.getStorageSync('both_Collected');
    //获取postId，使他从onLoad中传过来ID值
    var bothpostId=bothCollected[this.data.currentPostId];
    //取反操作，将收藏与被收藏在点击是可以进行互换
    bothpostId=!bothpostId;
    bothCollected[this.data.currentPostId]=bothpostId;//完成取反操作

    //在数据修改完成之后，刷新或者说是改变当前缓存的信息记录
    try{
      wx.setStorageSync('both_Collected',bothCollected);
    }catch(e){
        console.log("写入缓存数据错误");
    }
    //跟新完成后，切换数据绑定变量，实现切换图片
    this.setData({
      collected:bothpostId
    })
    wx.showToast({
      title: bothpostId?'收藏成功':'取消收藏',
      duration: 500
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