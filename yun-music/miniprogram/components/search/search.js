// components/search/search.js
/*
author:付金伟
time:2020.2.15
function:部落搜索组件
*/
let keyword='' //搜索关键字
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'请输入'
    }
  },
  //接受外部CSS样式
  externalClasses:[
    "iconfont",
    "icon-sousuo",
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取用户输入
    onInput(event){
      keyword=event.detail.value
    },
    //搜索
    onSearch(){
     this.triggerEvent('search',{
       keyword
     })
    }
  }
})
