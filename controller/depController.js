var dbConfig = require('../util/dbconfig')
var getDep = function(req,res){//get获取所有系信息
  // res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = 'select * from dep';
  var sqlArr= []
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
        'msg': '没有院系信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}
var getMajor = function(req,res){//get获取所有专业信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = 'select * from major';
  var sqlArr= []
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
        'msg': '没有专业信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}

var getClass = function(req,res){//获取所有班级
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = 'select * from class';
  var sqlArr= []
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
        'msg': '没有班级信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}

var getMajorByDep = function(req,res){//get获取某系所有专业信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var dep = req.query.dep
  var sql = 'select * from dep,major where dep.dep_id = major.sdep and dep.department = ?';
  var sqlArr= [dep]
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
        'msg': '没有专业信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}

var getClassByDep = function(req,res){//查询某系的所有班级
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `SELECT *FROM dep ,major,class 
  WHERE class.smajor = major.major_id 
  AND major.sdep = dep.dep_id 
  AND dep.department = ?`;
  var dep = req.query.dep 
  var sqlArr= [dep]
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
        'msg': '没有班级信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}

var getClassByMajor = function(req,res){//查询某专业的所有班级
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `SELECT *FROM major,class 
  WHERE class.smajor = major.major_id 
  AND major.mname = ?`;
  var major = req.query.major
  var sqlArr= [major]
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
        'msg': '没有班级信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}
var getStuByDep = function(req,res){//查询某系的所有学生
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `SELECT *FROM dep,major,class,stu_info 
  WHERE dep.dep_id = major.sdep 
  AND class.smajor = major.major_id 
  AND stu_info.class_id =class.class_id 
  AND dep.department = ?`;
  var dep = req.query.dep
  var sqlArr= [dep]
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
        'msg': '没有学生信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}

var getStuByMajor = function(req,res){//查询某专业的所有学生
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `SELECT *FROM major,class,stu_info 
  WHERE class.smajor = major.major_id 
  AND stu_info.class_id =class.class_id 
  AND major.mname = ?`;
  var major = req.query.major
  var sqlArr= [major]
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
        'msg': '没有学生信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}

var getStuByClass = function(req,res){//查询某班级的所有学生
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `SELECT *FROM class,stu_info 
  WHERE stu_info.class_id =class.class_id 
  AND class.class_name = ?`;
  var class_name = req.query.class
  var sqlArr= [class_name]
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
        'msg': '没有学生信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
}
/*
初始化选课表，将所有课程信息完成之后，初始化一次，将学生的选课表自动完成，
若初始化后，修改过选课表 就不应该再进行初始化操作，否则覆盖原先的操作
若初始化后添加了课程信息，那么如何添加进选课表中呢？
将当前课程所授课的班级的所有学生添加该课程（暂）
INSERT INTO sc(stu_id ,course_info_id)
SELECT stu_id ,course_info.course_info_id FROM stu_info ,course_class,course_info 
WHERE stu_info.`class_id` = course_class.`class_id`
AND course_class.`course_info_id` = course_info.`course_info_id` 
 */

module.exports = {
  getDep,
  getMajor,
  getClass,
  getMajorByDep,
  getClassByDep,
  getClassByMajor,
  getStuByDep,
  getStuByMajor,
  getStuByClass,

}