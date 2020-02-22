//封装为一个模块,dateJS中对应的date类型
module.exports = (date) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss' //格式化目标字符串
  const dui = {
    'M+': date.getMonth() + 1, //程序中月份是0-11
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  //判断年份是否可以匹配到
  if (/(y+)/.test(fmt)) {
    //replace替换 RegExp正则表达式 $1正则第一子表达式  date.getFullYear()替换当前年份
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  //('+k+') 指代每个时间的正则
  for (let k in dui) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, dui[k].toString().length == 1 ? '0' + dui[k] : dui[k])
    }
  }
  return fmt
}