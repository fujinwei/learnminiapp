// pages/playList/playList.js
var MIX_LIST=15;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //引用bannerURL
    swiperImgUrls: [{
      url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg'
    }, {
      url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg'
    }, {
      url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg'
    }],
    //歌单内容，死内容
    playList: [],
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求云函数
    this.getyun();
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
      this.setData({
        playList:[]
      })
      this.getyun();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getyun();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //加载云函数
  getyun:function(){
    wx:wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        start:this.data.playList.length,//开始的长度
        count:MIX_LIST
      }
    }).then((res)=>{
      this.setData({
        playList:this.data.playList.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})