const db = require('../models/index')
const Sequelize = require('sequelize')
const validator = require('../validations/user.validator')
const userServices = require('../service/user.service')
const notiDTO = require('../service/noti.service')
const { uploadDrive } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')



class controller {
    async updateAvatar(req, res) {
        const img = await uploadDrive(req.files.file.data)
        if (!img) return res.json({
            code: 500,
            status: "",
            message: 'Upload img failed'
        })
        try {
            const result = await userServices.saveAvatar(req.user._id, img)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async defaultAvatar(req, res) {
        const img = 'https://drive.google.com/uc?export=view&id=1ykzTh94lBOt09jupQcdLeG1NflVo5jiq'
        try {
            const result = await userServices.saveAvatar(req.user._id, img)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async updateInfomation(req, res) {
        req.body.id = req.user._id
        try {
            const result = await userServices.saveChange(req.body)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async updatePassword(req, res) {
        try {
            const salt = await bcrypt.genSaltSync(10)
            const hashPassword = await bcrypt.hash(req.body.n_password, salt)
            const result = await userServices.newPassword(req.user._id, req.body.password, hashPassword)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async follow(req, res) {
        try {
            const result = await userServices.follow(req.user._id, req.params.id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async unfollow(req, res) {
        try {
            const result = await userServices.unfollow(req.user._id, req.params.id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async getUserInfo(req, res) {
        try {
            const result = await userServices.getUserInfo(req.params.id, req.user._id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async search(req, res) {
        try {
            const result = await userServices.search(req.query.username, req.user._id)
            // return res.status(result.code).json(result)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
    async notification(req, res) {
        // return res.json({
        //     result: await notiDTO.getNoti(req.user._id)
        // })
        // try {
        //     const result = await userServices.getNoti(req.user._id)
        return res.status(result.code).json(result)
        return res.json(result)
        // } catch (error) {
        //     next(error)
        // }
    }
}

module.exports = new controller