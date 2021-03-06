/*
author:付金伟
time:2020.2.10
function:歌曲信息组件
*/
const app=getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //将传过来的musiclist定义为了数组
      musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1
  },
  //页面的生命周期
  pageLifetimes:{
    show(){
      this.setData({
        playingId:parseInt(app.getplayingMusicId()),
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      const ecd=event.currentTarget.dataset
      const musicid=ecd.musicid
      this.setData({
        playingId:musicid
      })
      wx.navigateTo({
        url: `../player/player?musicId=${musicid}&index=${ecd.index}`,
      })
    }
  }
})
