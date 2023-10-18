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
                if (typeof (req.files.file.length) == "number") {
                    for (let i = 0; i < req.files.file.length; i++) {
                        images.push({ IMAGE: await uploadDrive(req.files.file[i].data), POST_ID: id })
                    }
                } else {
                    images.push({ IMAGE: await uploadDrive(req.files.file.data), POST_ID: id })
                }
            }
            const result = await postServices.savePost(post, images)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }

    }
    async updatePost(req, res) {

    }
    async deletePost(req, res) {

    }
    async likePost(req, res) {
        try {
            const result = await postServices.likePost(req.user._id, req.params.id)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async unlikePost(req, res) {
        try {
            if (await dto.unlikePost(req.user._id, req.params.id)) {
                await notiDTO.deleteNoti(req.params.id, req.user._id, "like")
                return res.json({
                    status: 1,
                    message: ''
                })
            }
            return res.json({
                status: 0,
                message: ''
            })

        } catch (error) {
            console.log(error.message);
            return res.json({
                status: 0,
                message: error.message
            })
        }
    }
    async commentPost(req, res) {
        const post = await db.POST.findByPk(req.params.post_id)
        console.log(post);
        const cmt = {
            ID: createId(),
            CREATED_BY: req.user._id,
            POST_ID: req.params.post_id,
            CONTENT: req.body.content,
        }
        if (req.params.comment_id != "none") {
            cmt.COMMENT_REPLIED_TO = req.params.comment_id
        }
        try {
            if (await dto.comment(cmt)) {
                await notiDTO.createNoti({ USER_ID: req.user._id, R_USER_ID: post.CREATED_BY_USER_ID, POST_ID: req.params.post_id, TYPE: "comment" })
                return res.json({
                    status: 1,
                    message: ''
                })
            }
            return res.json({
                status: 0,
                message: ''
            })

        } catch (error) {
            console.log(error.message);
            return res.json({
                status: 0,
                message: error.message
            })
        }
    }
    async getComment(req, res) {
        // return res.json({
        //     result: await postServices.getComment(req.params.post_id)
        // })
        try {
            const result = await postServices.getComment(req.params.post_id)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async getPostByUser(req, res) {
        return res.json({
            result: await dto.getPostByUser(req.params.user_id)
        })
    }
}

module.exports = new postController