const MAX_length = 140 //最大输入长度

const MAX_img = 9 //最大上传图片的数量

const db=wx.cloud.database()//数据库初始化

let content='' //文字内容
let userInfo={} //用户信息对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0, //底部菜单距离底部的距离
    images: [], //存放图片的数组
    isPhote: true //当前图片是否选满
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo=options  //获取用户信息
  },
  //获取用户输入信息
  onInput(event) {
    var wordsNum = event.detail.cursor //获取输入长度
    if (wordsNum >= MAX_length) {
      wordsNum = `最大字数为${MAX_length}`
    }
    this.setData({
      wordsNum: wordsNum,
    })
    content=event.detail.value
  },
  //获取焦点和失去焦点的方法
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  //选择图片
  onChooseImage() {
    let maxImg = MAX_img - this.data.images.length //还能选择几张
    wx.chooseImage({
      count: maxImg,
      sizeType: ['original', 'compressed'], //图片类型
      sourceType: ['album', 'camera'], //图片源头（相机或图库）
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        let maxImg = MAX_img - this.data.images.length //显示一次后还能选择几张
        this.setData({
          isPhote: maxImg <= 0 ? false : true
        })
      }

    })
  },
  //删除图片
  onDelect(event) {
    this.data.images.splice(event.target.dataset.index) //删除对应的图片，改变了图片数组
    this.setData({
      images: this.data.images
    })
    if (this.data.images == MAX_img - 1) {
      this.setData({
        isPhote: true //这样就可以在删的不是9张时显示加号图标
      })
    }
  },
  //点击查看预览图片
  onChaKanImg(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },
  //发布提交云数据库
  send() {
    //提交检查,Content.trim()去除空格检查
    if (content.trim()==='') {
      wx.showToast({
        title:'请输入内容',
      })
      return
    }
    wx.showToast({
      title:'发布中',
    })
    let promiseArr = []
    let fileIDs=[]  //存放图片数据ID
    for (var i = 0, len = this.data.images.length; i < len; i++) {
      //每次循环new出来一个新的Promise对象，resolve表示成功，reject表示失败
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        //取到文件扩展名
        var suffix = /\.\w+$/.exec(item)[0]
        //每次只能上传一张照片
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix, //云端路径
          filePath: item, //当前文件临时路径
          success: (res) => {
            fileIDs=fileIDs.concat(res.fileID)//每次追加上新的fileID
            resolve()
          },
          fail: (err) => {
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    //存入云数据库
    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({
        data:{  
          ...userInfo, //用户信息
          content:content, //内容   openID自动生成
          img:fileIDs, //图片
          createTime:db.serverDate(), //服务端时间
        }
      }).then((res)=>{
        wx.showToast({
          title:'发布成功',
        })
        //返回主页并刷新
        wx.navigateBack()
      })
    }).catch((err)=>{
      wx.showToast({
        title:'发布失败',
      })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})