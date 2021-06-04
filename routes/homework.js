const express = require('express');
var router = express.Router();
var multer = require('multer')
var homework = require('../controller/homeworkController')

router.post('/uploadhomework', multer({
  dest: 'upload'
}).array('files'), homework.uploadHomework)
router.post('/stuuploadhomework', multer({
  dest: 'upload/homework'
}).array('files'), homework.stuUploadHomework)
// router.post('/', multer({
//   dest: 'upload'
// }).single('file'), callback())
router.post('/uploadgrade',homework.uploadGrade)//教师上传作业分数
router.get('/gethomework', homework.getHomework)//获取作业列表
router.get('/gethomeworkdetail', homework.getHomeworkDetail)//获取学生id的作业id的内容
router.get('/gethomeworkdetailbyid', homework.getHomeworkDetailById)
//获取作业id的所有人提交的作业
router.get('/getcoursestuallhomework', homework.getCourseStuAllhomework)//学生查看该课程自己的所有作业
router.get('/downloadhomework', homework.downHomework)//下载作业对应的课件
router.post('/deletehomework', homework.deleteHomework)//删除作业


module.exports = router