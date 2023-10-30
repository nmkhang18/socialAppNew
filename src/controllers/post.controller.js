const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { uploadDrive } = require('../helpers/helpers')
const postServices = require('../service/post.service')
const { createId } = require('../helpers/helpers')
const notiDTO = require('../service/noti.service')


class postController {
    async createPost(req, res, next) {
        try {
            const id = createId()
            const post = {
                ID: id,
                CREATED_BY_USER_ID: req.user._id,
                CAPTION: req.body.caption ? req.body.caption : '',
            }
            let images = []
            if (req.files) {
                console.log(req.files.file);
                if (typeof (req.files.file.length) == "number") {

                    for (let i = 0; i < req.files.file.length; i++) {
                        if (req.files.file[i].mimetype.split('/')[0] != "image" && req.files.file[i].mimetype.split('/')[0] != "multipart") return res.json({
                            code: 0,
                            status: 0,
                            message: "File must be image",
                            result: null
                        })
                        images.push({ IMAGE: await uploadDrive(req.files.file[i].data), POST_ID: id })
                    }
                } else {
                    if (req.files.file.mimetype.split('/')[0] != "image" && req.files.file.mimetype.split('/')[0] != "multipart") return res.json({
                        code: 0,
                        status: 0,
                        message: "File must be image",
                        result: null
                    })
                    images.push({ IMAGE: await uploadDrive(req.files.file.data), POST_ID: id })
                }
            }
            const result = await postServices.savePost(post, images)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }

    }
    async updatePost(req, res) {
        try {
            let images = []
            if (req.files) {
                console.log(req.files.file);
                if (typeof (req.files.file.length) == "number") {

                    for (let i = 0; i < req.files.file.length; i++) {
                        if (req.files.file[i].mimetype.split('/')[0] != "image" && req.files.file[i].mimetype.split('/')[0] != "multipart") return res.json({
                            code: 0,
                            status: 0,
                            message: "File must be image",
                            result: null
                        })
                        images.push({ IMAGE: await uploadDrive(req.files.file[i].data), POST_ID: id })
                    }
                } else {
                    if (req.files.file.mimetype.split('/')[0] != "image" && req.files.file.mimetype.split('/')[0] != "multipart") return res.json({
                        code: 0,
                        status: 0,
                        message: "File must be image",
                        result: null
                    })
                    images.push({ IMAGE: await uploadDrive(req.files.file.data), POST_ID: id })
                }
            }
            // const result = await postServices.savePost(post, images)
            const result = await postServices.updatePost(req.params.id, req.body.caption, images)

            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async deletePost(req, res) {

    }
    async likePost(req, res) {
        try {
            const result = await postServices.likePost(req.user._id, req.params.id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async unlikePost(req, res) {
        try {
            const result = await postServices.unlikePost(req.user._id, req.params.id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async commentPost(req, res, next) {
        try {
            const post = await db.POST.findByPk(req.params.post_id)
            const cmt = {
                ID: createId(),
                CREATED_BY: req.user._id,
                POST_ID: req.params.post_id,
                CONTENT: req.body.content,
            }
            if (req.params.comment_id) {
                cmt.COMMENT_REPLIED_TO = req.params.comment_id
            }
            const result = await postServices.comment(cmt)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async getComment(req, res) {
        try {
            const result = await postServices.getComment(req.params.post_id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async getPostByUser(req, res) {
        try {
            const result = await postServices.getPostByUser(req.params.user_id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new postController