const db = require('../models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const accessServices = require('../service/access.service')
const OtpGenerator = require('otp-generator')

class accessController {
    async signIn(req, res, next) {
        try {
            const result = await accessServices.signIn(req.body)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async verifyOTP(req, res, next) {
        try {
            const result = await accessServices.verifyOTP(req.body)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async signUp(req, res, next) {
        try {
            const result = await accessServices.signUp(req.body)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async getOTP(req, res, next) {
        try {
            const result = await accessServices.getOTP(req.body, req.params.type)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
    async resetPassword(req, res, next) {
        try {
            const result = await accessServices.resetPassword(req.body)
            return res.status(result.code).json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new accessController