const express = require('express')
const accessController = require('../controllers/access.controller')
const accessValidator = require('../middlewares/validate/access')
const router = express.Router()


router.post('/signUp', accessValidator.signUp, accessController.signUp)
router.post('/getOTP/:type', accessValidator.getOTP, accessController.getOTP)
router.post('/signIn', accessValidator.signIn, accessController.signIn)
router.put('/resetPassword', accessValidator.resetPassword, accessController.resetPassword)


// router.post('/', controller.add)
// router.put('/enable/:id', controller.enable)
// router.put('/disable/:id', controller.disable)



module.exports = router