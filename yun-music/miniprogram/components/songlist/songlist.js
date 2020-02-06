// components/songlist/songlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //组件自定义属性
    playlist: {
      type: Object
    }
  },
  //组件的数据监听
  observers: {
      ['playlist.playCount'](event){
        this._tranNumber(event,2);
        this.setData({
          _playCount:this._tranNumber(event,2)
        })
      }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _playCount:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //格式化处理字符数字，point为保留小数位数，num为传过来的数字
    _tranNumber(num,point){
      //将获取到的数字进行处理，如果小数点后有位数，那么舍掉
      var number=num.toString().split('.')[0];
      //如果数字小于6位，即10W以内，直接返回输出
      if(number.length<6) {
        return number;
      }else if (number.length>=6&&number.length<=8) {
        //取小数部分，用千位百位作为小数部分,parseInt是将数字整数化，parseFloat是字符化
        var decimal=number.substring(number.length-4,number.length-4+point);
        return parseFloat(parseInt(num/10000)+'.'+decimal)+"万"
      }else if (number>8) {
        var decimal=number.substring(number.length-8,number.length-8+point);
        return parseFloat(parseInt(num/100000000)+'.'+decimal)+"亿"
      }
    }
      
  }
})