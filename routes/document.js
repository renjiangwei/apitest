const express = require('express');
var router = express.Router();
var multer = require('multer')
var document = require('../controller/documentController')

router.post('/uploaddocument', multer({
  dest: 'upload/document'
}).array('files'), document.uploadDocument);//教师上传课件
// router.post('/', multer({
//   dest: 'upload'
// }).single('file'), callback())
router.get('/getdocument',document.getDocument)//获取课件内容
router.get('/downloaddocument', document.downDocument)//下载课件
router.post('/deletedocument',document.deleteDocument)//删除课件
module.exports = router