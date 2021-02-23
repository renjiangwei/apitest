var dbConfig = require('../util/dbconfig')
var getUsers = function (req, res) {//index路由查询所有用户（暂时留着）
  res.header("Access-Control-Allow-Origin", "*");
  // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  // res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // res.header('Access-Control-Allow-Headers', 'Content-Type');
  var sql = 'select * from stu';
  var sqlArr = [];
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
    } else {
      res.send(data);
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
  
}
var getUsersById = function(req,res){//get请求请求体中特定id的用户
  var {id} = req.query;//解构出id
  var sql = 'select * from stu where id = ?';
  var sqlArr = [id];
  var callBack = function(err,data){
    if(err){
      console.log('连接出错');
    }else{
      res.send(data);
    }

  }
  dbConfig.sqlConnect(sql,sqlArr,callBack);
}
// var getUsersById = function (req, res) {//post请求用户
//   var id = req.body.id;
//   var sql = 'select * from stu where id = ?';
//   var sqlArr = [id];
//   var callBack = function (err, data) {
//     if (err) {
//       console.log('连接出错');
//     } else {
//       res.send(data);
//     }

//   }
//   dbConfig.sqlConnect(sql, sqlArr, callBack);
// }
var login = function (req, res) {//post登录验证id和密码
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By','3.2.1');
  // res.header('Content-Type',"text/plain;charset=utf-8")
  // res.header('Content-Type',"application/json")
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  
  var id = req.body.id;
  var password = req.body.password;
  var sql = 'select * from stu where id = ? and password = ?';
  var sqlArr = [id, password];
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '用户名或密码出错'
      })
    } else {
      req.session.id = id;
      res.send({
        'code': 200,
        'msg': '登录成功',
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var stuInfo = function (req, res) {//get请求学生信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie跨域
  if (!req.session.id){
    res.send({
      code:400,
      msg:'请登陆'
    });
    return;
  }
  var id = req.query.id;
  var sql = 'select * from stu_info where id = ?';
  var sqlArr = [id];
  
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '学生不存在'
      })
    } else {
      // req.session.id = id;
      res.send(data)
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var teaInfo = function (req, res) {//get请求教师信息
  if (!req.session.id){
    res.send({
      code:400,
      msg:'请登陆'
    });
    return;
  }
  var id = req.query.id;
  var sql = 'select * from teacher_info where id = ?';
  var sqlArr = [id];
  
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '教师不存在'
      })
    } else {
      // req.session.id = id;
      res.send(data)
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
  getUsers,
  getUsersById,
  login,
  stuInfo,
  teaInfo
}
