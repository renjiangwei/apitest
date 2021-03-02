const { request } = require('express');
const express = require('express')
var router = express.Router();
var course = require('../controller/courseController')

router.get('/initcourse',course.initCourse) // /course/initcourse初始化选课表！注意不要覆盖选课信息
router.get('/initcourse2',course.initCourse2)
// router.get('/allcourse',course.getCourseInfo) // /course/allcourse查询所有
router.get('/courseclass',course.getCourseClass) //查询某课程id所授课班级 get   
router.get('/coursebyid',course.getCourseById) // /course/coursebyid get传stuid 返回选课所有信息
router.get('/teachercoursebyid',course.getCourseByIdTeacher)
module.exports = router