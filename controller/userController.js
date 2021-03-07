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


var login = function (req, res) {//post登录验证id和密码
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  // res.header('Content-Type',"text/plain;charset=utf-8")
  // res.header('Content-Type',"application/json")
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  
  var id = req.body.id;
  var password = req.body.password;
  var sql = 'select * from stu where stu_id = ? and password = ?';
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

var teacherLogin = function (req, res) {//post登录验证id和密码
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  // res.header('Content-Type',"text/plain;charset=utf-8")
  // res.header('Content-Type',"application/json")
  res.header("Access-Control-Allow-Credentials", "true");//cookie

  var id = req.body.id;
  var password = req.body.password;
  var sql = 'select * from teacher where teacher_id = ? and password = ?';
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
  // if (!req.session.id){
  //   res.send({
  //     code:400,
  //     msg:'请登陆'
  //   });
  //   return;
  // }
  var id = req.query.id;
  var sql = `select stu_id,name,age,class_name,phone,email,sex,mname,department
  from stu_info,class ,major ,dep
  where stu_info.class_id = class.class_id
  and class.smajor = major.major_id
  and major.sdep = dep.dep_id
  and stu_id = ?`;
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
      // res.send(data)
      let result = {
        'code' :200,
        'data' :{
          id:data[0].stu_id,
          name:data[0].name,
          age:data[0].age,
          class:data[0].class_name,
          phone:data[0].phone,
          email:data[0].email,
          sex:data[0].sex,
          mname:data[0].mname,
          dep:data[0].department,

        }
      }
      res.send(result)
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var teaInfo = function (req, res) {//get请求教师信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie跨域
  // if (!req.session.id){
  //   res.send({
  //     code:400,
  //     msg:'请登陆'
  //   });
  //   return;
  // }
  var id = req.query.id;
  var sql = `select teacher_info_id,name,age,phone,email,sex,department
  from teacher_info,dep 
  where teacher_info.dep_id = dep.dep_id
  and teacher_info_id = ?`;
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
      // res.send(data)
      let result = {
        'code' :200,
        'data' :{
          id:data[0].teacher_info_id,
          name:data[0].name,
          age:data[0].age,
          phone:data[0].phone,
          email:data[0].email,
          sex:data[0].sex,
          dep:data[0].department
        }
      }
      res.send(result)
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
  getUsers,
  login,
  teacherLogin,
  stuInfo,
  teaInfo
}
