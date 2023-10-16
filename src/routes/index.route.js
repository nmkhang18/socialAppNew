const express = require('express')
const router = express.Router()

const homeRouter = require('./home.route')
const authencationRouter = require('./access.route')
const messegeRouter = require('./messege.route')
const postRouter = require('./post.route')
const userRouter = require('./user.route')


router.use('/home', homeRouter)
router.use('/', authencationRouter)
router.use('/messege', messegeRouter)
router.use('/post', postRouter)
router.use('/user', userRouter)


module.exports = router