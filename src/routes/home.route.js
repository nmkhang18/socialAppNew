const express = require('express')
const controller = require('../controllers/home.controller')
const router = express.Router()
const authencation = require('../middlewares/access.middleware')

//GET
router.get('/', authencation.login, controller.getNewfeeds)
router.get('/relevantUser', controller.getRelevantUser)


//POST


//PUT


module.exports = router