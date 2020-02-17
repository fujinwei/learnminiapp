// components/login-souquan/login-souquan.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
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
    onGetUserInfo(event){
      console.log(event)
      const userInfo=event.detail.userInfo
      //如果detail.userInfo存在，那么就是授权成功的，否则是授权失败，即被拒绝
      if (userInfo) {
        this.setData({
          modalShow:false
        })
        this.triggerEvent('loginsuccess',userInfo)
      }else{
        this.triggerEvent('loginfail',)
      }
    }
  }
})
