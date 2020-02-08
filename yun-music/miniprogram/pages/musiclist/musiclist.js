// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //歌曲列表信息传给组件、歌曲详细内容信息对象
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '歌曲信息加载中',
    })
    //调用云函数
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId, //获取歌单ID传给云函数
        $url: 'musiclist'
      }
    }).then((res) => {
      const rrp = res.result.playlist
      this.setData({
        musiclist: rrp.tracks,
        listInfo: {
          coverImgUrl: rrp.coverImgUrl, //封面信息
          name: rrp.name //歌单名称
        }
      })
      wx.hideLoading()
      this._setMusiclist()
    })
  },
  //获取到歌曲信息并存储本地的方法
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)

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