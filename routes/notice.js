const express = require('express')
var router = express.Router();
var notice = require('../controller/noticeController')
router.get('/noticeinfo',notice.getNotice)//get方法获取课程的notice
router.post('/deletenotice',notice.deleteNotice)//post方法删除指定id的notice
router.post('/addnotice',notice.addNotice)//post方法添加notice
module.exports = router