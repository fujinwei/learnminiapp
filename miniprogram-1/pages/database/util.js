//星星的函数
function convertToStarsArry(stars){
  //获取数据后只要第一个数字，进行截取
  var num=stars.toString().substring(0,1);
  var array=[];
  //使用循环来判断获取到的是几颗星【1,2,3,4,5】
  for(var i=1;i<=5;i++){
    if(i<=num){
      array.push(1);
    }else{
      array.push(0);
    }
  }
  return array;
}

module.exports={
  convertToStarsArry:convertToStarsArry
}