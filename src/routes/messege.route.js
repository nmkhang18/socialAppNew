const express = require('express')
const messegeController = require('../controllers/messege.controller')
const middleware = require('../middlewares/messege.middleware')
const authencation = require('../middlewares/access.middleware')

const router = express.Router()

//GET
router.get('/:conversationId', authencation.login, middleware.isValidMember, messegeController.getMessege)
router.get('/', authencation.login, messegeController.getConv)
router.get('/user/:id', authencation.login, middleware.checkConversation, messegeController.createConversation)


//POST
router.post('/:conversationId', authencation.login, middleware.isValidMember, messegeController.createMessege)



//PUT

//DELETE
router.delete('/:conversationId', messegeController.deleteMessege)



module.exports = router