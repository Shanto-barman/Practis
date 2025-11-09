const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUsers, getMe, showUser} =require('../controller/userController.js');
const { checkUserToken } = require("../../../middleware/AuthUsercheck.js");

router.post('/create', createUser);

router.post('/login',loginUser);

router.get('/gert-users', checkUserToken, getUsers)

router.get('/me', checkUserToken, getMe)

router.get('/:id', showUser);

// router.put('/updat-user',updatUser)

module.exports = router