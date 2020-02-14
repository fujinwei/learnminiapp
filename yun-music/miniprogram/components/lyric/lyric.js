// components/lyric/lyric.js
/*
author:付金伟
time:2020.2.12
function:歌词组件
*/

let lyricHeight=0 //歌词高度
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false
    },
    lyric:String,
  },
  /*
      属性监听器
  */
 observers:{
  lyric(lrc){
    if (lrc=='暂无歌词') {
      this.setData({
        lrcList:[{
          lrc,
          time:0,
        }],
        nowLyricIndex:-1  //谁也不高亮显示
      })
    }else{
      this._parseLyric(lrc)
    }
  }
 },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList:[],  //存放歌词的数组
    nowLyricIndex:0,//当前选中歌词的索引
    scrollTop:0,//滚动条滚动的高度

  },
  //生命周期函数
  lifetimes:{
    ready(){
    //将PX于RPX进行换算 宽度默认为750rpx
      wx.getSystemInfo({ //获取手机的一些信息
        success(res){
          //求出1rpx的大小
          lyricHeight=res.screenWidth/750*64
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //传递过来的时间
    update(event){
      //歌词与时间对应
      let lrcList=this.data.lrcList
      if (lrcList.length==0) {
        return
      }
      //当歌曲播放时间比当前歌词最后一句的事件还要大,那么也让他滚动到最后
      if (event>lrcList[lrcList.length-1].time) {
        if(this.data.nowLyricIndex!=-1){
          this.setData({
            nowLyricIndex:-1,
            scrollTop:lrcList.length*lyricHeight
          })
        }
      }
      for(let i=0,len=lrcList.length;i<len;i++){
        if (event<=lrcList[i].time) {//歌曲播放时间<=遍历中数组的时间,那么歌词高亮显示
          this.setData({
            nowLyricIndex:i-1, //小于当前歌词，肯定是选中上一个歌词，所以i-1
            scrollTop:(i-1)*lyricHeight //索引乘上每一句歌词的高度
          })
          break
        }
      }
    },
    //解析歌词
    _parseLyric(sLyric){
      //通过每一行的换行，取到每一行的歌词
      let line=sLyric.split('\n')
      let _lrcList=[]
      line.forEach((elem)=>{
        //逐行解析
        let time=elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)//取到每一行的时间
        if (time!=null) {
          let lrc=elem.split(time)[1]//歌词
          let timeReg=time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          //将时间转换为秒
          let time2Seconds=parseInt(timeReg[1])*60+parseInt(timeReg[2])+parseInt(timeReg[3])/1000
          //将歌词显示在桌面，需要进行一个对应的存储
          _lrcList.push({
            time:time2Seconds,
            lrc
          })
        }
      })
      this.setData({
        lrcList:_lrcList
      })
    },
  }
})
