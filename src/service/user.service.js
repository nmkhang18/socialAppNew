const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')
class userServices {
    async saveChange(user) {
        try {
            const result = await db.USER.findByPk(user.id)
            if (!result) return 0
            result.USERNAME = user.username
            result.FULLNAME = user.fullname
            result.ADDRESS = user.address
            result.MOBILE = user.mobile
            result.GENDER = user.gender
            result.DESCRIPTION = user.description

            await result.save()
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: null
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
    async saveAvatar(user_id, img) {
        try {
            const result = await db.USER.findByPk(user_id)
            if (!result) return 0
            result.AVATAR = img
            await result.save()
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: null
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
    async newPassword(user_id, old_p, new_p) {
        try {
            const result = await db.USER.findByPk(user_id)
            if (!result) return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: "",
                result: null
            }
            if (bcrypt.compareSync(old_p, result.PASSWORD)) {
                result.PASSWORD = new_p
                await result.save()
                return {
                    code: StatusCodes.OK,
                    status: ReasonPhrases.OK,
                    message: "",
                    result: null
                }
            }
            return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: "",
                result: null
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
    async follow(user_id, followed_user_id) {
        if (user_id == followed_user_id) return {
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: "",
            result: null
        }
        try {
            await db.FOLLOWER.create({
                FOLLOWING_USER_ID: user_id,
                FOLLOWED_USER_ID: followed_user_id
            })

            let sockets = await db.USER_SOCKET.findAll({
                where: {
                    USER_ID: followed_user_id,
                }
            })
            sockets.forEach(element => {
                global._io.to(element.dataValues.SOCKET_ID).emit("follow", {
                    USER_ID: followed_user_id
                });
            });

            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: null
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
    async unfollow(user_id, followed_user_id) {
        try {
            const result = await db.FOLLOWER.findOne({
                where: {
                    FOLLOWING_USER_ID: user_id,
                    FOLLOWED_USER_ID: followed_user_id,
                }
            })
            await result.destroy()
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: null
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
    async getUserInfo(user_id, id) {
        try {
            const result = await db.USER.findByPk(user_id, {
                attributes: [
                    "ID",
                    "USERNAME",
                    "FULLNAME",
                    "AVATAR",
                    "GENDER",
                    "MOBILE",
                    "ADDRESS",
                    "GENDER",
                    "DESCRIPTION",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWING_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWING_USER_ID" = "USER"."ID" GROUP BY "FOLLOWER"."FOLLOWING_USER_ID"), 0)`),
                        'FOLLOWING',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                        'FOLLOWERS',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("POST1"."CREATED_BY_USER_ID") FROM "POST" AS "POST1" WHERE "POST1"."CREATED_BY_USER_ID" = "USER"."ID" GROUP BY "POST1"."CREATED_BY_USER_ID"), 0)`),
                        'POSTS',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" AND "FOLLOWER"."FOLLOWING_USER_ID" = '${id}' GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                        'ISFOLLOWED',
                    ],
                ]
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    user: result
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
    async search(username, id) {
        try {
            const result = await db.USER.findAll({
                attributes: [
                    "ID",
                    "USERNAME",
                    "FULLNAME",
                    "AVATAR",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" AND "FOLLOWER"."FOLLOWING_USER_ID" = '${id}' GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                        'ISFOLLOWED',
                    ],
                ],
                where: {
                    USERNAME: {
                        [Op.like]: `%${username}%`
                    },
                    ID: {
                        [Op.ne]: id
                    }
                }
            })

            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    users: result
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
    async getFollowers(user_id, id) {
        try {
            let flwers = await db.FOLLOWER.findAll({
                where: {
                    FOLLOWED_USER_ID: user_id
                }
            })
            flwers = flwers.map(data => {
                return data.dataValues.FOLLOWING_USER_ID
            })
            const result = await db.USER.findAll({
                attributes: [
                    "ID",
                    "USERNAME",
                    "FULLNAME",
                    "AVATAR",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" AND "FOLLOWER"."FOLLOWING_USER_ID" = '${id}' GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                        'ISFOLLOWED',
                    ],
                ],
                where: {
                    ID: flwers
                }
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    users: result
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
    async getFollowed(user_id, id) {
        try {
            let flwers = await db.FOLLOWER.findAll({
                where: {
                    FOLLOWING_USER_ID: user_id
                }
            })
            flwers = flwers.map(data => {
                return data.dataValues.FOLLOWED_USER_ID
            })
            const result = await db.USER.findAll({
                attributes: [
                    "ID",
                    "USERNAME",
                    "FULLNAME",
                    "AVATAR",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" AND "FOLLOWER"."FOLLOWING_USER_ID" = '${id}' GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                        'ISFOLLOWED',
                    ],
                ],
                where: {
                    ID: flwers
                }
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    users: result
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

module.exports = new userServices