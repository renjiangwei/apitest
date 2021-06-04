var dbConfig = require('../util/dbconfig')
var log4js = require('../util/log4js')
var logger = log4js.getLogger()
const fs = require('fs')
const moment = require('moment');


// var uploadHomework = function (req, res) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('X-Powered-By', '3.2.1');
//   res.header("Access-Control-Allow-Credentials", "true");//cookie
//   console.log('请求来了');
//   console.log(req.files);
// }
var uploadHomework = function (req, res) {//教师上传作业
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var files = req.files;
  var fileList = [];//文件数组
  var filePaths = [];//文件路径数组
  var date = moment().format("yyyy-M-DD-HH-mm-ss");//生成一个当前时间
  if (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      //时间_文件名格式存放文件，保证不会重名，
      fs.renameSync(file.path, `upload/${date}_${file.originalname}`)//真正储存文件的名称
      file.path = `upload/${date}_${file.originalname}`//文件的path属性
      filePaths.push(file.path)
      fileList.push(file)
    }
  }

  // console.log(filePaths);
  // console.log(fileList);
  // res.send(fileList)
  //req.files是传入文件的参数名
  var courseid = req.body.courseid
  var content = req.body.content
  var createTime = req.body.createtime
  var deadline = req.body.deadline
  var teacherid = req.body.teacherid
  //postman 中测试form-data格式，暂时没问题
  var sql = `insert into homework (scourse,content,file_path,create_time,deadline,teacher_id)
  values(?,?,?,?,?,?)`
  var sqlArr = [
    courseid,
    content,
    JSON.stringify(filePaths),//数组转JSON字符串存放在数据库
    createTime,
    deadline,
    teacherid
  ]
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
        'msg': '数据不存在'
      })
    } else {
      // req.session.id = id;
      // res.send(data)
      logger.info("教师" + teacherid + "上传作业" + "文件为：" + JSON.stringify(filePaths))
      res.send({
        'code': 200,
        'msg': "上传成功"
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var stuUploadHomework = function (req, res) {//学生提交作业
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var files = req.files;
  var fileList = [];//文件数组
  var filePaths = [];//文件路径数组
  var date = moment().format("yyyy-M-DD-HH-mm-ss");//生成一个当前时间
  if (files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      //时间_文件名格式存放文件，保证不会重名，
      //目录在/upload/homework下
      fs.renameSync(file.path, `upload/homework/${date}_${file.originalname}`)//真正储存文件的名称
      file.path = `upload/homework/${date}_${file.originalname}`//文件的path属性
      filePaths.push(file.path)
      fileList.push(file)
    }
  }
  //作业id，学生id，内容，file_path，create_time，成绩，教师留言评论
  var stu_homework_id = req.body.homework_id
  var stu_homework_content = req.body.homework_content
  var stu_homework_create_time = req.body.createtime
  var stu_homework_stu_id = req.body.stu_id

  var sql = `insert into stu_homework 
  (stu_homework_id,stu_homework_content,stu_homework_file_path,
    stu_homework_create_time,stu_homework_stu_id)
  values(?,?,?,?,?)`
  var sqlArr = [
    stu_homework_id,
    stu_homework_content,
    JSON.stringify(filePaths),//数组转JSON字符串存放在数据库
    stu_homework_create_time,
    stu_homework_stu_id
  ]
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
        'msg': '数据不存在'
      })
    } else {
      // req.session.id = id;
      // res.send(data)
      logger.info("学生" + stu_homework_stu_id + "上传作业" + "文件为：" + JSON.stringify(filePaths))
      res.send({
        'code': 200,
        'msg': "上传成功"
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var uploadGrade = function (req, res) {//教师提交作业分数
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  let homework_id = req.body.homework_id
  let stu_homework_stu_id = req.body.stu_homework_stu_id
  let grade = req.body.grade
  let comment = req.body.comment
  var sql = `
  UPDATE stu_homework 
  SET stu_homework_grade = ?,stu_homework_comment = ?
  WHERE stu_homework_stu_id = ?
  AND stu_homework_id = ?
  `
  var sqlArr = [
    grade,
    comment,
    stu_homework_stu_id,
    homework_id,
  ]
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
        'msg': '数据不存在'
      })
    } else {
      logger.info(stu_homework_stu_id + "学生的作业" + homework_id + "被教师评分")
      res.send({
        'code': 200,
        'msg': "上传成功"
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var getHomework = function (req, res) {//根据课程id查询作业信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.query.id//参数为课程id 查询该课的作业
  var sql = `
  SELECT *FROM homework,teacher_info
  WHERE homework.teacher_id = teacher_info.teacher_info_id
  AND scourse = ?
  `
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
        'msg': '没有作业'
      })
    } else {
      let i = 0
      var result = [

      ]
      while (data[i]) {
        // console.log(data[i]);
        // console.log(JSON.parse(data[i].file_path));
        result[i] = {
          homework_id: data[i].homework_id,
          content: data[i].content,
          create_time: data[i].create_time,
          deadline: data[i].deadline,
          teacher_name: data[i].name,
          filePathes: JSON.parse(data[i].file_path)
        }
        data[i]
        i++
      }
      res.send({
        "code": 200,
        "data": result
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var getHomeworkDetail = function (req, res) {//根据作业id，学生id查询该学生该作业内容打分评价
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var homework_id = req.query.homework_id//参数为课程id 查询该课的作业
  var stu_id = req.query.stu_id
  var sql = `
  SELECT *FROM stu_homework
  WHERE stu_homework_id = ?
  AND stu_homework_stu_id = ?
  `
  var sqlArr = [homework_id, stu_id]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 404,
        'msg': '没有提交作业'
      })
    } else {
      let result = {
        homework_id: data[0].stu_homework_id,
        homework_content: data[0].stu_homework_content,
        homework_create_time: data[0].stu_homework_create_time,
        homework_grade: data[0].stu_homework_grade,
        homework_comment: data[0].stu_homework_comment,
        homework_file_path: JSON.parse(data[0].stu_homework_file_path)
      }
      res.send({
        "code": 200,
        "data": result
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var getHomeworkDetailById = function (req, res) {
  //根据作业id，查询所有学生该作业内容打分评价
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var homework_id = req.query.homework_id//参数为作业id
  var sql = `
  SELECT *FROM stu_homework,stu_info
  WHERE stu_homework.stu_homework_stu_id = stu_info.stu_id
  AND stu_homework_id = ?
  `
  var sqlArr = [homework_id]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 404,
        'msg': '没有人提交作业'
      })
    } else {
      let a = []
      let i = 0

      while (data[i]) {
        let result = {
          homework_id: data[i].stu_homework_id,
          homework_content: data[i].stu_homework_content,
          homework_create_time: data[i].stu_homework_create_time,
          homework_grade: data[i].stu_homework_grade,
          homework_comment: data[i].stu_homework_comment,
          homework_file_path: JSON.parse(data[i].stu_homework_file_path),
          stu_homework_stu_id: data[i].stu_homework_stu_id,
          stu_name: data[i].name
        }
        a.push(result)
        i++
      }
      res.send({
        "code": 200,
        "data": a
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var getCourseStuAllhomework = function (req, res) {//学生查询该课程自己的所有作业
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var stu_id = req.query.stu_id//学生id
  var scourse = req.query.scourse//课程id
  var sql = `
  SELECT * FROM homework ,stu_homework
  WHERE homework.homework_id = stu_homework.stu_homework_id
  AND stu_homework.stu_homework_stu_id = ?
  AND scourse = ?
  `
  var sqlArr = [stu_id,scourse]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 404,
        'msg': '没有提交作业'
      })
    } else {
      let a = []
      let i = 0
      while (data[i]) {
        let result = {
          homework_id: data[i].homework_id,
          homework_content: data[i].content,
          homework_file_path: JSON.parse(data[i].file_path),
          create_time:data[i].create_time,
          stu_homework_content:data[i].stu_homework_content,
          stu_homework_file_path:data[i].stu_homework_file_path,
          stu_homework_create_time:data[i].stu_homework_create_time,
          stu_homework_grade: data[i].stu_homework_grade,
          stu_homework_comment: data[i].stu_homework_comment,
          stu_homework_file_path: JSON.parse(data[i].stu_homework_file_path),
        }
        a.push(result)
        i++
      }
      // console.log(data);
      res.send({
        "code": 200,
        "data": a
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var getAllStuHomework = function (req, res) {//教师查询该课程该作业所有人提交的作业
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var stu_id = req.query.stu_id//学生id
  var scourse = req.query.scourse//课程id
  var sql = `
  SELECT * FROM homework ,stu_homework
  WHERE homework.homework_id = stu_homework.stu_homework_id
  AND stu_homework.stu_homework_stu_id = ?
  AND scourse = ?
  `
  var sqlArr = [stu_id,scourse]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else if (data == '') {
      res.send({
        'code': 404,
        'msg': '没有提交作业'
      })
    } else {
      let a = []
      let i = 0
      while (data[i]) {
        let result = {
          homework_id: data[i].homework_id,
          homework_content: data[i].content,
          homework_file_path: JSON.parse(data[i].file_path),
          create_time:data[i].create_time,
          stu_homework_content:data[i].stu_homework_content,
          stu_homework_file_path:data[i].stu_homework_file_path,
          stu_homework_create_time:data[i].stu_homework_create_time,
          stu_homework_grade: data[i].stu_homework_grade,
          stu_homework_comment: data[i].stu_homework_comment,
          stu_homework_file_path: JSON.parse(data[i].stu_homework_file_path),
        }
        a.push(result)
        i++
      }
      // console.log(data);
      res.send({
        "code": 200,
        "data": a
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var downHomework = function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var url = req.query.url
  console.log(url);
  res.download(url)
}

var deleteHomework = function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.body.id;
  var sql = `
  select * FROM homework
  WHERE homework_id = ?
  `
  var sql2 = `
  delete from homework
  where homework_id = ?
  `
  var sqlArr = [id]
  new Promise((resolve, reject) => { // 查询记录
    dbConfig.sqlConnect(sql, sqlArr, (err, result) => {
      if (err || result.length === 0) {
        reject(err)
      } else {
        var data = result[0]
        resolve(data)//将查询的结果传出
      }
    })
  }).then(result => {//这里的result就是resolve传过来的data
    return new Promise((resolve, reject) => {
      dbConfig.sqlConnect(sql2, sqlArr, (err, res) => {
        if (!err) {
          resolve(result)//注意这里是resolve(result)不是res,将最开始查询的结果传递到下面then里
        } else {
          reject(err)
        }
      })
    })
  }).then(result => {
    var pathes = JSON.parse(result.file_path)//数组存放pathes
    let i = 0
    while (pathes[i]) {
      fs.unlinkSync(pathes[i])
      i++
    }
    logger.warn("作业" + id + "被删除");
    res.send({
      "code": 200,
      "msg": "删除成功"
    })
  }).catch(err => {
    res.send({
      "code": 400,
      "msg": err
    })
  })

}
module.exports = {
  uploadHomework,
  stuUploadHomework,
  getHomework,
  getHomeworkDetail,
  getHomeworkDetailById,
  getCourseStuAllhomework,
  downHomework,
  deleteHomework,
  uploadGrade,
}