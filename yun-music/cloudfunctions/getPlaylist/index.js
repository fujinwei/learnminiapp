/*
author:付金伟
time:2020.2.1
function:用于读取上传云数据库歌单数据
*/


// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

//云数据库初始化
var db = cloud.database();
//定义一个依赖
var rp = require('request-promise');
//获取音乐推荐接口
var URL = 'http://musicapi.xiecheng.live/personalized';
var playlistDBcollection = db.collection('playlistDB');



var mix_list = 100;
// 云函数入口函数
exports.main = async (event, context) => {

  //获取数据库集合中已经有的信息
  //获取集合数据
  var countResult = await playlistDBcollection.count();
  //取到总的数据转换为求的多少的数据条数
  var total = countResult.total;
  //计算查询条数
  var batchTimes = Math.ceil(total / mix_list);
  //表示当前任务,存放获取到的对象
  var tasks = [];
  for (var i = 0; i < batchTimes; i++) {
    //获取到的总的条数，转化为总条数limit(mix_list)，skip(i*mix_list)利用每次读取100条计算执行次数
    var promises = playlistDBcollection.skip(i * mix_list).limit(mix_list).get();
    tasks.push(promises);
  }
  var list = {
    data: [] //数据在list 的data下
  }
  if (tasks.length > 0) {
    //所有数据都执行完，进行累加数据,acc以前的值，cur当前循环遍历的值
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        //拼接上数据的值
        data: acc.data.concat(cur.data)
      }
    })
  }

  //获取当前服务器端最新的歌单信息
  //本身为一个异步操作，在操作完成后可以返回一个值。第一个参数为要往哪里传送数据，成功后进入.then函数中,返回一个res
  var playlist = await rp(URL).then((res) => {
    //将我们想要的字符串通过JSON.parse转换成对应的对象
    return JSON.parse(res).result;
  })

  //进行新旧数据处理对比,因为新获取数据肯定比旧数据长，所以第一个循环用这数据比较，进行去重处理
  var newData = [];
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    //用状态标志位判断当前是否重复，重复直接跳出，不重复将值传给newData
    var flag = true;
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break;
      }
    }
    if (flag) {
      newData.push(playlist[i]);
    }
  }
  //通过循环遍历将对应的返回结果插入到我们的云数据库中
  //数据插入只能单条加入，是一个异步的过程，所以在async await中我们还是需要加一个await进行异步处理
  for (var i = 0, len = newData.length; i < len; i++) {
    //取到集合
    await playlistDBcollection.add({
      data: {
        //获取到的每一个值，ES6的...展开方式
        ...newData[i],
        //定义歌单时间(获取服务器时间)，用于排序歌单展示时间先后
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功');
    }).catch((err) => {
      console.error('插入失败');
    })
  }
  return newData.length;
}