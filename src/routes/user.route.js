const express = require('express')
const controller = require('../controllers/user.controller')
const router = express.Router()
const authencation = require('../middlewares/access.middleware')


//GET
router.get('/follow/:id', authencation.login, controller.follow)
router.get('/unfollow/:id', authencation.login, controller.unfollow)
router.get('/info/:id', authencation.login, controller.getUserInfo)
router.get('/search', authencation.login, controller.search)
router.get('/notification', authencation.login, controller.notification)


//POST



//PUT
router.put('/', authencation.login, controller.updateInfomation)
router.put('/avatar', authencation.login, controller.updateAvatar)
router.put('/avatar/default', authencation.login, controller.defaultAvatar)
router.put('/password', authencation.login, controller.updatePassword)



//DELETE
router.delete('/avatar', controller.defaultAvatar)


module.exports = router