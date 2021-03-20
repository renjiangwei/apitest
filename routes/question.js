const express = require('express');
var router = express.Router();
var question = require('../controller/questionController')

router.get('/getquestionbycourseid',question.getQuestionByCourseId);//获取该课程的所有问题
router.get('/getanswerbyquestionid',question.getAnswerByQuestionId);//获取该问题的所有回复
router.post('/uploadquestion',question.uploadQuestion);//上传问题
router.post('/deletequestion',question.deleteQuestion);//删除问题
router.post('/uploadanswer',question.uploadAnswer);//发送回复
router.post('/deleteanswer',question.deleteAnswer);//删除回复

module.exports = router