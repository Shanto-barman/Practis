const express = require("express")
const router =express.Router()
const userRoutes = require('./src/module/user/routes/userRouter')

router.use('/user', userRoutes)

module.exports = router