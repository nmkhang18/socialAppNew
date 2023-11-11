const db = require('../models/index')
const Sequelize = require('sequelize')
const messageServices = require('../service/messege.service')
const { createId, uploadDrive } = require('../helpers/helpers')


class messegeController {
    async getConv(req, res, next) {
        try {
            const result = await messageServices.getConv(req.user._id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async createConversation(req, res, next) {
        try {
            const id = createId()

            const result = await messageServices.createConv(id, [{ CONVERSATION_ID: id, USER_ID: req.user._id }, { CONVERSATION_ID: id, USER_ID: req.params.id }])
            if (result.status == "CREATED") return res.redirect(`/api/messege/${id}?page=0&offset=0`)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async getMessege(req, res, next) {
        const { page } = req.query
        try {
            const result = await messageServices.getMessege(req.params.conversationId, parseInt(page) * 5, 5, req.user._id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async createMessege(req, res, next) {
        try {
            if (req.body.type == 'text') {
                const result = await messageServices.createMessege(req.user._id, req.params.conversationId, req.body.type, req.body.content)
                // return res.status(result.code).json(result)
                return res.json(result)
            } else if (req.body.type == 'image') {
                if (!req.files.file) return res.json({
                    status: 0,
                    message: 'No image'
                })
                if (req.files.file.mimetype.split('/')[0] != "image" && req.files.file.mimetype.split('/')[0] != "multipart") return res.json({
                    code: 0,
                    status: 0,
                    message: "File must be image",
                    result: null
                })
                const image = await uploadDrive(req.files.file.data)
                const result = await messageServices.createMessege(req.user._id, req.params.conversationId, req.body.type, image)
                // return res.status(result.code).json(result)
                return res.json(result)
            } else {
                next({ status: 503, message: "Service Unavailable" })
            }
        } catch (error) {
            next(error)
        }
    }
    async deleteMessege(req, res, next) {

    }
}

module.exports = new messegeController