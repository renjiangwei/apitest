var dbConfig = require('../util/dbconfig')
var moment = require('moment')
var fs = require('fs')
var log4js = require('../util/log4js')
var logger = log4js.getLogger()
var uploadDocument = function (req, res) {//教师上传课件
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
      fs.renameSync(file.path, `upload/document/${date}_${file.originalname}`)//真正储存文件的名称
      file.path = `upload/document/${date}_${file.originalname}`//文件的path属性
      filePaths.push(file.path)
      fileList.push(file)
    }
  }

  // console.log(filePaths);
  // console.log(fileList);
  // res.send(fileList)
  //req.files是传入文件的参数名
  var courseid = req.body.scourseid
  var content = req.body.content
  var createTime = req.body.createtime
  //postman 中测试form-data格式，暂时没问题
  var sql = `insert into document (scourse_id,content,file_path,create_time)
  values(?,?,?,?)`
  var sqlArr = [
    courseid,
    content,
    JSON.stringify(filePaths),//数组转JSON字符串存放在数据库
    createTime,
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
      logger.info("上传课件" + "文件为：" + JSON.stringify(filePaths))
      res.send({
        'code': 200,
        'msg': "上传成功"
      })
    }

  }
  dbConfig.sqlConnect(sql, sqlArr, callBack);
}

var getDocument = function (req, res) {//获取某课程的课件
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.query.id//参数为课程id 查询该课的课件
  var sql = `
  SELECT *FROM document
  WHERE scourse_id = ?
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
        'msg': '没有课件'
      })
    } else {
      let i = 0
      var result = [

      ]
      while (data[i]) {
        console.log(data[i]);
        // console.log(JSON.parse(data[i].file_path));
        result[i] = {
          document_id: data[i].document_id,//
          content: data[i].content,
          create_time: data[i].create_time,
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

var downDocument = function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var url = req.query.url
  console.log(url);
  res.download(url)
}
var deleteDocument = function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('X-Powered-By', '3.2.1');
  res.header("Access-Control-Allow-Credentials", "true");//cookie
  var id = req.body.id;
  var sql = `
  select * FROM document
  WHERE document_id = ?
  `
  var sql2 = `
  delete from document
  where document_id = ?
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
    logger.warn("课件" + id + "被删除");
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
  uploadDocument,
  getDocument,
  downDocument,
  deleteDocument,
}