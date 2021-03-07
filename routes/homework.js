const express = require('express');
var router = express.Router();
var multer = require('multer')
var homework = require('../controller/homeworkController')

router.post('/uploadhomework', multer({
  dest: 'upload'
}).array('files'), homework.uploadHomework)
// router.post('/', multer({
//   dest: 'upload'
// }).single('file'), callback())
router.get('/gethomework',homework.getHomework)//获取作业列表
router.get('/downloadhomework',homework.downHomework)//下载作业对应的课件
router.post('/deletehomework',homework.deleteHomework)//下载作业对应的课件

module.exports = router