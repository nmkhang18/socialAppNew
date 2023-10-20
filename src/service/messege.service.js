const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')
const { createId } = require('../helpers/helpers')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')
class messageServices {
    async getMessege(id, offset, limit) {
        try {
            const result = await db.MESSEGES.findAll({
                where: {
                    CONVERSATION_ID: id
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                offset: offset,
                limit: limit
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    messeges: result
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
    async createMessege(user_id, con_id, type, content) {
        try {
            const messege = {
                ID: createId(),
                SEND_USER_ID: user_id,
                CONVERSATION_ID: con_id,
                TYPE: type,
                CONTENT: content
            }
            const createdMessege = await db.MESSEGES.create(messege)
            let users = await db.USER_CONVERSATION.findAll({
                where: {
                    CONVERSATION_ID: con_id
                }
            })
            users = users.map(data => {
                return data.dataValues.USER_ID
            })
            let sockets = await db.USER_SOCKET.findAll({
                where: {
                    USER_ID: users
                }
            })
            sockets = sockets.map(data => {
                return data.dataValues.SOCKET_ID
            })
            sockets.forEach(element => {
                global._io.to(element).emit("new-messege", createdMessege);
            });
            return {
                code: StatusCodes.CREATED,
                status: ReasonPhrases.CREATED,
                message: "",
                result: null
            }
        } catch (error) {
            console.log(error);
            return {
                code: StatusCodes.SERVICE_UNAVAILABLE,
                status: ReasonPhrases.SERVICE_UNAVAILABLE,
                message: error.message,
                result: null
            }
        }
    }
    async createConv(id, users) {
        try {
            await sequelize.transaction(async t => {
                await db.CONVERSATION.create({ ID: id, TITLE: '' }, { transaction: t })
                await db.USER_CONVERSATION.bulkCreate(users, { transaction: t })
            })
            return {
                code: StatusCodes.CREATED,
                status: ReasonPhrases.CREATED,
                message: "",
                result: null
            }
        } catch (error) {
            return {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: "",
                result: null
            }
        }
    }
    async getConv(user_id) {
        try {
            const result = await db.USER_CONVERSATION.findAll({
                where: {
                    USER_ID: user_id
                },
                attributes: [],
                include: {
                    model: db.CONVERSATION,
                    attributes: ["ID", "TITLE"],
                    include: {
                        model: db.USER_CONVERSATION,
                        attributes: ["USER_ID"],
                        where: {
                            USER_ID: {
                                [Op.not]: user_id
                            }
                        },
                        include: {
                            model: db.USER,
                            attributes: ["USERNAME", "FULLNAME", "AVATAR"],
                            required: true
                        },
                        required: true
                    },
                    required: true
                }

            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    conversations: result
                }
            }
        } catch (error) {
            return {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: "",
                result: null
            }
        }
    }
}

module.exports = new messageServices