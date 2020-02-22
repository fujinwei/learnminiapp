/*
author:付金伟
time:2020.2.17
function:blog卡片组件
*/
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object
  },
  observers:{
    ['blog.createTime'](val){
      //如果时间值存在，传递过去格式化
      if (val) {
        this.setData({
          _createTime:formatTime(new Date(val))
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //博客内容放大预览图片
    onyulan(event){
      const ds=event.target.dataset
      wx.previewImage({
        urls: ds.imgs,//图片地址
        current:ds.imgsrc,//图片数据库地址
      })
    }
  }
})
