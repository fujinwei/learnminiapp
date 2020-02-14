// pages/player/player.js
let musiclist = []
//正在播放中的index索引的值
let PlayingIndex = 0
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: "",
    isPlaying: false, //默认不播放
    isLyricShow: false, //歌词是否显示
    lyric: '', //定义初试歌词

    isSame: false, //是否是同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  //获取对应的歌曲信息
  _loadMusicDetail(musicId) {
    if ((musicId == app.getplayingMusicId())) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop() //用于点击上下曲时，暂停上一首歌曲
    }
    let music = musiclist[PlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    //将播放歌曲的歌曲ID，传给全局变量
    app.setplayingMusicId(musicId)

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicURL',
        musicId: musicId,
      }
    }).then((res) => {
      //做格式化输出
      let result = JSON.parse(res.result)
      //获取播放背景音频、将歌曲名字给了背景音频

      if (result.data[0].url==null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }

      if (!this.data.isSame) {
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.name
      }

      //如果开始播放，给isplaying改变一个状态
      this.setData({
        isPlaying: true
      })
      //加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'lyric',
          musicId
        }
      }).then((res) => {

        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc //将字符串转换成对应的对象
        if (lrc) {
          lyric = lrc.lyric
        } else {
          lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  //暂停播放切换点击事件,处理了时间联动
  onTogglePlaying: function () {
    if (this.data.isPlaying) {
      //为TRUE是正在播放,将它暂停
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    //做数据绑定
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onShang: function () {
    PlayingIndex--
    if (PlayingIndex < 0) {
      PlayingIndex = musiclist.length - 1 //如果小于0，让他获取到最后一首歌的索引值
    }
    this._loadMusicDetail(musiclist[PlayingIndex].id) //获取对应歌曲信息
  },
  onXia: function () {
    PlayingIndex++
    if (PlayingIndex === musiclist.length) { //如果最大到了歌单长度，那么播放第一首音乐
      PlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[PlayingIndex].id) //获取对应歌曲信息
  },
  /**
   * 跳转歌词显示页面
   */
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //给组件传递参数
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime) //自带属性取到组件，写上对应的选择器（class的内容）update是提前在歌词组件中定义的函数
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  }
})