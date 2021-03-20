const express = require('express')
var router = express.Router();
var course = require('../controller/courseController')

router.get('/initcourse',course.initCourse) // /course/initcourse初始化选课表！注意不要覆盖选课信息
router.get('/initcourse2',course.initCourse2)//init tc
// router.get('/allcourse',course.getCourseInfo) // /course/allcourse查询所有
router.get('/courseclass',course.getCourseClass) //查询某课程id所授课班级 get   
router.get('/coursebyid',course.getCourseById) // /course/coursebyid get传stuid 返回选课所有信息
router.get('/teachercoursebyid',course.getCourseByIdTeacher)//
router.get('/courseinfobyid',course.getCourseInfoById)
router.get('/sc',course.getSC)// get传学生id 查询选课表
router.get('/tc',course.getTC)// get传教师id
router.post('/addstudent',course.addStudent)//post传stu_id,course_id
router.post('/deletestudent',course.deleteStudent)//post传stu_id,course_id


router.get('/getstudentlist',course.getCourseStudentList)//get传course_id，查询该课程的学生列表

module.exports = router