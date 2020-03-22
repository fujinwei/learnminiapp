//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        //环境ID
        env:'yun-music-sa44y',
        traceUser: true,
      })
    }

    this.getOpenid() //调用函数，响应获取openid


    //设置全局属性或方法
    this.globalData = {
      playingMusicId:-1,  //当前正在播放的歌曲ID
      openid:-1
    }
  },

  setplayingMusicId(musicId){
    this.globalData.playingMusicId=musicId
  },
  getplayingMusicId(){
    return this.globalData.playingMusicId
  },
  //返回用户的openID
  getOpenid(){
    wx.cloud.callFunction({
      name:'login'
    }).then((res)=>{
    const openid=res.result.openid
    this.globalData.openid=openid
    //存放到本地存储中,先判断用户是否播放过，是否为空
    if(wx.getStorageSync(openid)==''){
      wx.setStorageSync(openid, [])//初始化
    }
    
    })
  }
})
