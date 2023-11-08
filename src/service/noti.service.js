const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')

class notiServices {

    async getNoti(id) {
        try {
            const result = await db.NOTIFICATION.findAll({
                include: {
                    model: db.USER,
                    attributes: ["USERNAME", "AVATAR", "ID"],
                    require: true
                },
                where: {
                    R_USER_ID: id
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
            return {
                code: StatusCodes.CREATED,
                status: ReasonPhrases.CREATED,
                message: "",
                result: {
                    notifications: result
                }
            }
        } catch (error) {
            return {
                code: StatusCodes.SERVICE_UNAVAILABLE,
                status: ReasonPhrases.SERVICE_UNAVAILABLE,
                message: error.message,
                result: null
            }
        }
    }
}

module.exports = new notiServices