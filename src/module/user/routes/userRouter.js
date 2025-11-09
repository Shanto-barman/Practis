const express = require("express")
const router = express.Router()
const {createUser, loginUser, getUsers} =require('../controller/userController.js')

router.post('/create', createUser);

router.post('/login',loginUser);

router.get('/gert-users',  getUsers)

// router.put('/updat-user',updatUser)

module.exports = router