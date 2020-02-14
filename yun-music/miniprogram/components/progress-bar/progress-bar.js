// components/progress-bar/progress-bar.js
/*
author:付金伟
time:2020.2.10
function:歌曲进度条组件
*/

let movableAreaWidth = 0
let movableViewWidth = 0
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
let duration = 0 //以秒为单位的总时长
let currentSec = -1 //当前的秒数
let isMoving = false //表示当前进度条是否在拖拽
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00', //当前已播放时间
      totalTime: '00:00' //总的时长
    },
    movableDis: 0, //移动距离
    progress: 0, //当前播放的进度
  },
  //开始时调用的生命周期函数
  lifetimes: {
    ready() {
      if (this.properties.isSame==true&&this.data.showTime.totalTime=='00:00') {
        this._setTime()
      }
      this._getMovableDis();
      this._backgroundBGM();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      //判断是否是拖动产生的移动效果
      if (event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100 //当前移动进度
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd() {
      //对应时间获取
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false //拖动结束
    },



    //获取进度条宽度
    _getMovableDis() {
      const query = this.createSelectorQuery(); //返回一个实例化对象,通过该对象获取到宽度
      query.select('.movable-area').boundingClientRect() //获取到了movable-area的宽度
      query.select('.movable-view').boundingClientRect() //获取到了movable-view的宽度

      query.exec((rect) => {
        //获取执行所有的请求，按照上边请求的顺序返回一个数组，返回数组按顺序输出
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    //获取背景音乐
    _backgroundBGM() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onStop(() => { //停止

      })
      backgroundAudioManager.onPause(() => { //暂停
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onWaiting(() => { //监听当前音频，正在加载当中

      })
      backgroundAudioManager.onCanplay(() => { //监听背景音乐进入一个可以播放的状态
        //获取到歌曲信息时出现了很多undefined的情况，所以为了处理为空的状态，在获取到的时候直接判断一下当前获取到的是否为空，如果为空就进行处理,设置一个定时器进行一秒的延时进行处理获取时间
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => { //监听当前音乐的播放进度，只在前台播放时运行
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime; //对应歌词的信息
          const duration = backgroundAudioManager.duration;
          const sec = currentTime.toString().split('.')[0]
          if (sec != currentSec) {
            const currentTimeFmt = this._dateFormat(currentTime) //格式转化
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
          }
          currentSec = sec
          //联动歌词，抛出以秒为单位的currentTime（通过triggerEvent自定义事件将时间传递出去）
          this.triggerEvent('timeUpdate',{
            currentTime
          })
        }

      })
      backgroundAudioManager.onEnded(() => { //监听结束时的状态
        this.triggerEvent('musicEnd') //触发一个事件
      })
      backgroundAudioManager.onError(() => { //监听当前音乐播放错误时的转态
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    //设置当前时长
    _setTime() {
      duration = backgroundAudioManager.duration //获取时间
      const durationFmt = this._dateFormat(duration);
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}` //为数组中的某一个元素赋值的方法
      })
    },
    //获取到的时间都是以秒为单位的，格式化时间形式
    _dateFormat(sec) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    //时间补0操作
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    },
  }
})