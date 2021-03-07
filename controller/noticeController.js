var dbConfig = require('../util/dbconfig')
var getNotice = function (req, res) {//get请求课程的公告信息
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie跨域
  var id = req.query.id;//传入课程id 查询其公告
  var sql = `SELECT *
  FROM notice,teacher_info
  WHERE notice.teacher_id = teacher_info.teacher_info_id
  AND course_info_id = ? `;
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
        'msg': 'NOTICE存在'
      })
    } else {
      // console.log(data);
      let i = 0
      data1 = []
      while (data[i]) {
        // console.log(data[i].notice_time);
        data1[i] = {
          "notice_id": data[i].notice_id,
          "notice_title": data[i].notice_title,
          "notice_content": data[i].notice_content,
          "notice_time": data[i].notice_time,
          "notice_teacher_name": data[i].name,
        }
        i++
      }
      var result = {
        "code": 200,
        "data": data1
      }
      // console.log(result);
      res.send(result)
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var deleteNotice = function (req, res) {//post删除公告
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  // res.header('Content-Type',"text/plain;charset=utf-8")
  // res.header('Content-Type',"application/json")
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.body.id;
  var sql = `
  DELETE  FROM notice 
  WHERE notice_id = ?`;
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
        'msg': '出错'
      })
    } else {
      // req.session.id = id;
      res.send({
        'code': 200,
        'msg': '删除成功',
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
// DELETE  FROM notice 
// WHERE notice_id = '2'

var addNotice = function (req, res) {//post添加公告
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  // res.header('Content-Type',"text/plain;charset=utf-8")
  // res.header('Content-Type',"application/json")
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  let { course_info_id, notice_title, notice_content, notice_time, teacher_id } = req.body
  var sql = `
  INSERT INTO notice (course_info_id,notice_title,notice_content,notice_time ,teacher_id)
  VALUES
  (?,?,?,?,?)
  `;
  var sqlArr = [course_info_id, notice_title, notice_content, notice_time, teacher_id];
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
        'msg': '出错'
      })
    } else {
      // req.session.id = id;
      res.send({
        'code': 200,
        'msg': '插入成功',
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
  getNotice,
  deleteNotice,
  addNotice
}