var dbConfig = require('../util/dbconfig')
var log4js =  require('../util/log4js')
var logger = log4js.getLogger();
const moment = require('moment');

var getQuestionByCourseId = function (req, res) {//根据课程id查询问题列表
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.query.course_info_id//参数为课程id 查询该课的作业
  var sql = `
  SELECT *FROM question,stu_info
  WHERE question.stu_id = stu_info.stu_id
  AND question_scourse = ?
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
        'code': 404,
        'msg': '没有问题信息'
      })
    } else {
      let i = 0
      var result = [

      ]
      while (data[i]) {
        result[i] = {
          question_id: data[i].question_id,
          stu_id: data[i].stu_id,
          stu_name: data[i].name,
          question_content: data[i].question_content,
          question_create_time: data[i].question_create_time,
          answer_count: data[i].answer_count,
        }
        data[i]
        i++
      }
      logger.info("查看id为"+id+"的课程的问题")
      res.send({
        "code": 200,
        "data": result
      })
      
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var getAnswerByQuestionId = function (req, res) {//根据问题id查询所有回复
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.query.question_id//参数为问题id 查询该问题的回复
  var sql = `
  SELECT * FROM question_answer
  WHERE squestion_id = ?
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
        'code': 404,
        'msg': '没有回复信息'
      })
    } else {
      let i = 0
      var result = [

      ]
      while (data[i]) {
        result[i] = {
          answer_id: data[i].answer_id,
          squestion_id: data[i].squestion_id,
          sanswer_id: data[i].sanswer_id,
          answer_ancestor_id: data[i].answer_ancestor_id,
          answer_content: data[i].answer_content,
          answer_create_time: data[i].answer_create_time,
          answer_user_name: data[i].answer_user_name,
          answer_user_type: data[i].answer_user_type,
          answer_scourse: data[i].answer_scourse
        }
        data[i]
        i++
      }
      logger.info("查看id为"+id+"的问题的所有回答")
      res.send({
        "code": 200,
        "data": result
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var uploadQuestion = function (req, res) {//学生发起问题
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  /*
  stu_id, question_content,question_create_time,question_scourse属于哪个课程的问题
   */
  let stu_id = req.body.stu_id
  let question_content = req.body.question_content
  let question_create_time = req.body.question_create_time
  let question_scourse = req.body.question_scourse
  var sql = `
  INSERT INTO question (stu_id,question_content,question_create_time,question_scourse) 
  VALUES(?,?,?,?)
  `
  var sqlArr = [
    stu_id,
    question_content,
    question_create_time,
    question_scourse,
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
      logger.info("学生"+stu_id+"发起问题")
      res.send({
        'code': 200,
        'msg': "上传成功"
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

// var deleteQuestion = function (req, res) {//学生删除自己发出的问题，post问题id
//   //注意删除该问题时，需要删除该问题下的所有回答？，然后再删除问题，
//   //正常的需求应该是，删除了该问题，但是其他人的回复是没有权限删除的，
//   //所以数据库中不要建立外键
//   //删除问题后，仍然保留该问题的回答，
//   //虽然不会显示在问题的回答列表中，但是其他用户应该有权看自己的回复，尽管问题已近不在了
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('X-Powered-By', '3.2.1');
//   res.header("Access-Control-Allow-Credentials", "true");//cookie
//   let question_id = req.body.question_id
//   let sql = `
//   DELETE FROM question 
//   WHERE question_id = ?
//   `
//   let sql2 = `
//   DELETE FROM question_answer 
//   WHERE squestion_id = ?
//   `
//   var sqlArr = [question_id]
//   new Promise((resolve, reject) => {//先删除问题的所有回答
//     dbConfig.sqlConnect(sql2, sqlArr, (err, data) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(data)
//       }
//     })
//   }).then(result => {
//     return new Promise((resolve, reject) => {//然后删除问题
//       dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
//         if (err) {
//           reject(err)
//         }
//         else resolve(data)
//       })
//     })
//   }).then(result => {
//     res.send({
//       "code": 200,
//       "msg": "删除成功"
//     })
//   }).catch(err => {
//     res.send({
//       "code": 400,
//       "msg": err
//     })
//   })
// }
var deleteQuestion = function (req, res) {//删除问题
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  let question_id = req.body.question_id
  var sql = `
  DELETE FROM question 
  WHERE question_id = ?
  `
  var sqlArr = [question_id]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else {
      logger.warn("问题"+question_id+"被删除")
      res.send({
        'code': 200,
        'msg': "删除成功"
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
var uploadAnswer = function (req, res) {//发起回复
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  /*
  squestion_id,answer_ancestor_id,
  sanswer_id,answer_content,answer_create_time,
  answer_user_name,answer_user_type
   */
  let squestion_id = req.body.squestion_id
  let answer_ancestor_id = req.body.answer_ancestor_id
  let sanswer_id = req.body.sanswer_id
  let answer_content = req.body.answer_content
  let answer_create_time = req.body.answer_create_time
  let answer_user_name = req.body.answer_user_name
  let answer_user_id = req.body.answer_user_id
  let answer_user_type = req.body.answer_user_type
  let answer_scourse = req.body.answer_scourse
  var sql = `
  INSERT INTO question_answer
  (squestion_id,answer_ancestor_id,sanswer_id,answer_content,
    answer_create_time,answer_user_name,answer_user_id,answer_user_type,answer_scourse) 
  VALUES (?,?,?,?,?,?,?,?,?)
  `
  var sqlArr = [
    squestion_id,
    answer_ancestor_id,
    sanswer_id,
    answer_content,
    answer_create_time,
    answer_user_name,
    answer_user_id,
    answer_user_type,
    answer_scourse
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
        'code': 404,
        'msg': '数据不存在'
      })
    } else {
      logger.warn("用户"+answer_user_id+"发送回复")
      res.send({
        'code': 200,
        'msg': "上传成功"
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var deleteAnswer = function (req, res) {//删除回答
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  let answer_id = req.body.answer_id
  var sql = `
  DELETE FROM question_answer 
  WHERE answer_id = ?
  `
  var sqlArr = [answer_id]
  var callBack = function (err, data) {
    if (err) {
      console.log('连接出错');
      res.send({
        'code': 400,
        'msg': '出错了'
      })
    } else {
      logger.warn("回答"+answer_id+"被删除")
      res.send({
        'code': 200,
        'msg': "删除成功"
      })
    }
  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var getQuestionByStuId = function (req, res) {//根据学生id查询所有问题
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.query.stu_id//参数为问题id 查询该问题的回复
  var sql = `
  SELECT question.question_id , question.stu_id,
  stu_info.name,question.question_content,
  question.question_create_time,
  question.answer_count,
  question.question_scourse

  FROM question, stu_info
  WHERE question.stu_id = stu_info.stu_id
  AND question.stu_id = ?
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
        'code': 404,
        'msg': '没有回复信息'
      })
    } else {
      let i = 0
      let result = []
      while(data[i]){
        let a = {
          question_id: data[i].question_id,
          stu_id: data[i].stu_id,
          stu_name: data[i].name,
          question_content: data[i].question_content,
          question_create_time: data[i].question_create_time,
          answer_count: data[i].answer_count,
          question_scourse: data[i].question_scourse,
        }
        result.push(a)
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

var getAnswerByUserId = function (req, res) {//根据id查询所有回答
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.query.user_id//参数为问题id 查询该问题的回复
  var sql = `
  SELECT * FROM question_answer
  WHERE answer_user_id = ?
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
        'code': 404,
        'msg': '没有回复信息'
      })
    } else {
      res.send({
        "code": 200,
        "data": data
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
  getQuestionByCourseId,
  getAnswerByQuestionId,
  uploadQuestion,
  deleteQuestion,
  uploadAnswer,
  deleteAnswer,
  getQuestionByStuId,
  getAnswerByUserId,
}