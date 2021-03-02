const express = require('express');
var router = express.Router();
var user = require('../controller/userController');
router.get('/',user.getUsers);//暂时留着


module.exports = router;