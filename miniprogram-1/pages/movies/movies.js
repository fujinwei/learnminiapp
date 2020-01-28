var app = getApp();
var util = require('/../database/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jijiang = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=1&count=3"; //每个api只取三条数据
    var zhengzai = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var top = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMoviesData(jijiang, "comingSoon","即将上映");
    this.getMoviesData(zhengzai, "inTheaters","正在上映");
    this.getMoviesData(top, "top250","TOP250");
  },
  //数据API的判断
  getMoviesData: function (url, settKey,bannerTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: { //设置请求的header
        "content-type": ""
      },
      success: function (res) {
        //成功，则获取数据
        that.processDouban(res.data, settKey,bannerTitle);
      },
      fail: function () {
        console.log("shibai");
      },
    })
  },
  //对API进行梳理，只保留需要的内容,并且可以替换假数据
  processDouban: function (movieDouban, settKey,bannerTitle) {
    //定义数组作为数据处理完后的容器 
    var movies = [];
    //循环遍历数据中的数组
    for (var idx in movieDouban.subjects) {
      var subject = movieDouban.subjects[idx];
      var title = subject.title;
      //判断电影名字，进行长度截取。
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArry(subject.rating.stars),
        title: title, //标题
        average: subject.rating.average, //评分
        coverageUrl: subject.images.large, //图片主图
        movieId: subject.id //电影ID
      }
      movies.push(temp)
    }
    //动态数据绑定赋值
    var readyData = {};
    readyData[settKey] = {
      bannerTitle:bannerTitle,
      movies: movies
    }
    this.setData(readyData);
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