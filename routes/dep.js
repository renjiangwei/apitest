const express = require('express');
var router = express.Router();
var dep = require('../controller/depController')

router.get('/',dep.getDep)// /dep 查询所有院系
router.get('/allmajor',dep.getMajor) // /dep/allmajor 查询所有专业
router.get('/allclass',dep.getClass) // /dep/allclass 查询所有班级
router.get('/majorbydep',dep.getMajorByDep) // /dep/majorbydep get方法查询某系的专业
router.get('/classbydep',dep.getClassByDep) // /dep/classbydep get方法查询某系的班级
router.get('/classbymajor',dep.getClassByMajor)// /dep/classbymajor get方法查询某专业的班级
router.get('/stubydep',dep.getStuByDep) // /dep/stubydep get方法查询某系的学生
router.get('/stubymajor',dep.getStuByMajor) // /dep/stubymajor get方法查询某专业的学生
router.get('/stubyclass',dep.getStuByClass) // /dep/stubyclass get方法查询某班级的学生



module.exports = router;