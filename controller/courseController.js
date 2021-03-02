var dbConfig = require('../util/dbconfig')
var getCourseInfo = function (req, res) {//查询所有课程
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `SELECT *FROM course_info,course_class 
  WHERE course_info.course_info_id = course_class.course_info_id`;
  var sqlArr = []
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
        'msg': '没有课程信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}

var getCourseClass = function (req, res) {//查询某课程上课的班级（难用）
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  var sql = `SELECT *FROM course_class ,class 
  WHERE class.class_id = course_class.class_id
  AND course_class.course_info_id = ?`;
  var courseID = req.query.courseinfoid
  var sqlArr = [courseID]
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
        'msg': '没有信息'
      })
    } else {
      let i = 0
      let result ={
        'code': 200,
        'classes': []
      };
      while(data[i]){
        // console.log(data[i]);
        result['classes'][i] = {
          'id':data[i].class_id,
          'classname' : data[i].class_name
        } 
        i++
      }
      
      res.send(result)
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}

var getClass = function (courseInfoId, classes, resolve) {//有问题
  //classes是数组 注意resolve
  var sql = `SELECT *FROM course_class ,class 
  WHERE class.class_id = course_class.class_id
  AND course_class.course_info_id = ?`;
  var sqlArr = [courseInfoId]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接失败');
    } else if (data == '') {
      console.log('没数据');
    } else {
      // console.log(data);
      // var classes = []
      let i = 0
      while (data[i]) {
        // console.log(data[i]);
        classes[i] = {
          "id": data[i].class_id,
          "classname": data[i].class_name
        }
        i++
      }
      resolve('完成')

    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)

}
// a= []
// new Promise(resolve => {
//   getClass(1,a,resolve)
// }).then(res => {
//   console.log(res)
//   console.log(a);
// })

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

var initCourse = function (req, res) {//初始化选课表
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `INSERT INTO sc(stu_id ,course_info_id)
  SELECT stu_id ,course_info.course_info_id FROM stu_info ,course_class,course_info 
  WHERE stu_info.class_id = course_class.class_id
  AND course_class.course_info_id = course_info.course_info_id `;
  var sqlArr = []
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '操作出错，可能已经初始化'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '没有信息'
      })
    } else {
      res.send({
        'code': 200,
        'msg': '初始化成功'
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}

var initCourse2 = function (req, res) {//初始化授课表
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  var sql = `INSERT INTO tc(teacher_id,course_info_id)
  SELECT course_info.teacher_id ,course_info.course_info_id 
  FROM course_info ,teacher_info
  WHERE course_info.teacher_id = teacher_info.teacher_info_id
   `;
  var sqlArr = []
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '操作出错，可能已经初始化'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '没有信息'
      })
    } else {
      res.send({
        'code': 200,
        'msg': '初始化成功'
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
var getCourseById = function (req, res) {//查询某人的选课 get 传stuid得到详细信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  var sql = `SELECT *
  FROM sc ,course_info,course,teacher_info
  WHERE sc.course_info_id = course_info.course_info_id 
  AND course_info.scourse = course.course_id
  AND course_info.teacher_id = teacher_info.teacher_info_id
  AND stu_id= ?
  `;
  var id = req.query.id
  var sqlArr = [id]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '操作出错'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '没有信息'
      })
    } else {
      let i = 0
      let result = {
        'code': 200,
        'lesson': []
      }

      while (data[i]) {
        // console.log(data[i]);
        result['lesson'][i] = {
          'id': data[i].course_info_id,
          'name': data[i].cname,
          'num': data[i].num,
          "ftime": data[i].ftime,
          "fday": data[i].fday,
          "stime": data[i].stime,
          "sday": data[i].sday,
          "thtime": data[i].thtime,
          "thday": data[i].thday,
          "start": data[i].start,
          "end": data[i].end,
          "credit": data[i].credit,
          "type": data[i].type,
          "tname": data[i].name,
          // "classes": []
        }
        i++
      }
      res.send(result)
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}

var getCourseByIdTeacher = function (req, res) {//查询某人的选课 get 传stuid得到详细信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  var sql = `SELECT *FROM tc, course_info,course,teacher_info
  WHERE tc.teacher_id = course_info.teacher_id
  AND course_info.scourse = course.course_id
  AND teacher_info.teacher_info_id = tc.teacher_id
  AND tc.teacher_id = ?
  `;
  var id = req.query.id
  var sqlArr = [id]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '操作出错'
      })
    } else if (data == '') {
      res.send({
        'code': 400,
        'msg': '没有信息'
      })
    } else {
      let i = 0
      let result = {
        'code': 200,
        'lesson': []
      }

      while (data[i]) {
        // console.log(data[i]);
        result['lesson'][i] = {
          'id': data[i].course_info_id,
          'name': data[i].cname,
          'num': data[i].num,
          "ftime": data[i].ftime,
          "fday": data[i].fday,
          "stime": data[i].stime,
          "sday": data[i].sday,
          "thtime": data[i].thtime,
          "thday": data[i].thday,
          "start": data[i].start,
          "end": data[i].end,
          "credit": data[i].credit,
          "type": data[i].type,
          "tname": data[i].name,
          // "classes": []
        }
        i++
      }
      res.send(result)
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}
var getCourseInfoById = function (req, res) {//查询所有课程
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  var sql = `SELECT *FROM course_info,course_class 
  WHERE course_info.course_info_id = course_class.course_info_id`;
  let id = req.query.id
  var sqlArr = [id]
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
        'msg': '没有课程信息'
      })
    } else {
      res.send(data)
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack)
}

module.exports = {
  getCourseInfo,
  getCourseClass,
  initCourse,
  initCourse2,
  getCourseById,
  getCourseByIdTeacher,
}