const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')

class dto {
    async createNoti(noti) {
        try {
            await db.NOTIFICATION.create(noti)
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async deleteNoti(id1, id2, type) {
        try {
            const result = await db.NOTIFICATION.findOne({
                where: {
                    R_USER_ID: id1,
                    USER_ID: id2,
                    TYPE: type
                }
            })
            await result.destroy()
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async getNoti(id) {
        try {
            const result = await db.NOTIFICATION.findAll({
                include: {
                    model: db.USER,
                    attributes: ["USERNAME", "AVATAR"],
                    require: true
                },
                where: {
                    R_USER_ID: id
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
            })

            return result
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
}

module.exports = new dto