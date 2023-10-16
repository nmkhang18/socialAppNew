const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')

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
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async saveAvatar(user_id, img) {
        try {
            const result = await db.USER.findByPk(user_id)
            if (!result) return 0
            result.AVATAR = img
            await result.save()
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async newPassword(user_id, old_p, new_p) {
        try {
            const result = await db.USER.findByPk(user_id)
            if (!result) return 0
            if (bcrypt.compareSync(old_p, result.PASSWORD)) {
                result.PASSWORD = new_p
                await result.save()
                return 1
            }
            return 0
        } catch (error) {
            console.log(error.message);
            return 2
        }
    }
    async follow(user_id, followed_user_id) {
        try {
            await db.FOLLOWER.create({
                FOLLOWING_USER_ID: user_id,
                FOLLOWED_USER_ID: followed_user_id
            })
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
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
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
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
            return result
        } catch (error) {
            console.log(error.message);
            return 0
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

            return result
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
}

module.exports = new userServices