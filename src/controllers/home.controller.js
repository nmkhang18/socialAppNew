const db = require('../models/index')
const Sequelize = require('sequelize')
const postServices = require('../service/post.service')

class controller {
    async getNewfeeds(req, res, next) {
        try {
            const result = await postServices.getPost(req.user._id, 1, 1)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async getRelevantUser(req, res) {

    }
}

module.exports = new controller