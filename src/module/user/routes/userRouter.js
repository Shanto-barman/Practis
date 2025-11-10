const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUsers, getMe, showUser, refreshTokenUsen, refreshTokenUser} =require('../controller/userController.js');
const { checkUserToken, checkAdminToken } = require("../../../middleware/AuthUsercheck.js");

router.post('/create', createUser);

router.post('/login',loginUser);

router.post('/refresh-token', refreshTokenUser)

router.get('/gert-users', checkAdminToken, getUsers)

router.get('/me', checkUserToken, getMe)

router.get('/:id', showUser);

// router.put('/updat-user',updatUser)

module.exports = router