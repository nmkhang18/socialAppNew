const express = require('express')
const accessController = require('../controllers/access.controller')
const accessValidator = require('../middlewares/validate/access')
const router = express.Router()


router.post('/signUp', accessValidator.signUp, accessController.signUp)
router.post('/getOTP/:type', accessValidator.getOTP, accessController.getOTP)
router.post('/signIn', accessValidator.signIn, accessController.signIn)
router.post('/verifyOTP', accessValidator.verifyOTP, accessController.verifyOTP)
router.put('/resetPassword', accessValidator.resetPassword, accessController.resetPassword)

module.exports = router