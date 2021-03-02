const express = require('express');
var router = express.Router();
var user = require('../controller/userController');

// /user/login 学生登录接口
router.post('/login',user.login);
// /user/teacherLogin 教师登录接口
router.post('/teacherLogin',user.teacherLogin);
// /user/stuInfo 获取学生信息，get方法传入id
router.get('/stuInfo',user.stuInfo);
// /user/teaInfo 获取教师信息，get方法传入id
router.get('/teaInfo',user.teaInfo);
// router.get('/',(req,res) => {
//   res.send('helloworld')
// })
// router.post('/',(req,res) => {
//   console.log('收到请求体：',req.body)
//   res.status(201).send()
// })

module.exports = router;