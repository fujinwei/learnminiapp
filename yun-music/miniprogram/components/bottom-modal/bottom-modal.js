// components/bottom-modal/bottom-modal.js
/*
author:付金伟
time:2020.2.15
function:底部弹出层组件
*/
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //控制弹出层是否显示
    modalShow:Boolean,
  },

  options:{
    styleIsolation:'apply-shared',
    multipleSlots:true  //启用多个插槽
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
 //弹出窗关闭事件
  onClose(){
    this.setData({
      modalShow:false
    })
  },
  }
})
