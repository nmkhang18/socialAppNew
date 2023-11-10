const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail, createId } = require('../helpers/helpers')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')

class postServices {
    async getPostDetail(id) {
        try {
            const result = await db.POST.findOne({
                where: {
                    ID: id
                },
                include: {
                    model: db.POST_IMAGE,
                    required: false,
                    attributes: ["ID", "IMAGE"]
                }
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    post: result
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
    async getPost(userId, offset, limit) {
        try {
            const getFollowed = await db.FOLLOWER.findAll({
                where: {
                    FOLLOWING_USER_ID: userId
                },
                attributes: ["FOLLOWED_USER_ID"]
            })
            let followed = []
            getFollowed.forEach(element => {
                followed.push(element.dataValues.FOLLOWED_USER_ID)
            })
            followed.push(userId)
            const result = await db.POST.findAll({
                include: [
                    {
                        model: db.POST_IMAGE,
                        required: false,
                        attributes: ["ID", "IMAGE"]
                    },
                    {
                        model: db.USER,
                        required: true,
                        attributes: [
                            "ID",
                            "USERNAME",
                            "FULLNAME",
                            "AVATAR",
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
                            ]
                        ]
                    }
                ],
                where: {
                    CREATED_BY_USER_ID: followed
                },
                attributes: [
                    "ID",
                    "CAPTION",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" GROUP BY "POST"."ID"), 0)`),
                        'LIKES',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("COMMENT"."POST_ID") FROM "COMMENT" WHERE "COMMENT"."POST_ID" = "POST"."ID" GROUP BY "POST"."ID"), 0)`),
                        'COMMENTS',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" AND "LIKE"."USER_ID" = '${userId}' GROUP BY "POST"."ID"), 0)`),
                        'ISLIKED',
                    ],
                    "createdAt",
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
            })

            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    newFeeds: result
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
    async savePost(post, images) {
        try {
            await sequelize.transaction(async t => {
                await db.POST.create(post, { transaction: t })
                await db.POST_IMAGE.bulkCreate(images, { transaction: t })
            })
            return {
                code: StatusCodes.CREATED,
                status: ReasonPhrases.CREATED,
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

    async likePost(user_id, post_id) {
        try {
            const post = await db.POST.findByPk(post_id)
            await db.LIKE.create({
                USER_ID: user_id,
                POST_ID: post_id
            })
            await db.NOTIFICATION.create({ USER_ID: user_id, R_USER_ID: post.CREATED_BY_USER_ID, POST_ID: post_id, TYPE: "like" })

            let sockets = await db.USER_SOCKET.findAll({
                where: {
                    [Op.or]: {
                        USER_ID: post.CREATED_BY_USER_ID,
                    }
                }
            })
            sockets.forEach(element => {
                global._io.to(element.dataValues.SOCKET_ID).emit("like", {
                    USER_ID: user_id,
                    POST_ID: post_id
                });
            });
            return {
                code: StatusCodes.CREATED,
                status: ReasonPhrases.CREATED,
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
    async unlikePost(user_id, post_id) {
        try {
            await db.LIKE.destroy({
                where: {
                    USER_ID: user_id,
                    POST_ID: post_id
                }
            })
            await db.NOTIFICATION.destroy({
                where: {
                    USER_ID: user_id,
                    POST_ID: post_id,
                    TYPE: "like"
                }
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
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
    async comment(cmt) {
        try {
            const post = await db.POST.findByPk(cmt.POST_ID)
            await db.COMMENT.create(cmt)
            await db.NOTIFICATION.create({ USER_ID: cmt.CREATED_BY, R_USER_ID: post.CREATED_BY_USER_ID, POST_ID: cmt.POST_ID, TYPE: "comment" })
            if (cmt.COMMENT_REPLIED_TO) {
                await db.NOTIFICATION.create({ USER_ID: cmt.CREATED_BY, R_USER_ID: cmt.COMMENT_REPLIED_TO, POST_ID: cmt.POST_ID, TYPE: "comment" })
            }
            let sockets = await db.USER_SOCKET.findAll({
                where: {
                    [Op.or]: {
                        USER_ID: post.CREATED_BY_USER_ID,
                        USER_ID: cmt.COMMENT_REPLIED_TO ? cmt.COMMENT_REPLIED_TO : "-1"

                    }
                }
            })
            sockets.forEach(element => {
                global._io.to(element.dataValues.SOCKET_ID).emit("comment", cmt);
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
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: "",
                result: null
            }
        }
    }
    async getComment(post_id) {
        try {
            const result = await db.COMMENT.findAll({
                include: [
                    {
                        model: db.COMMENT,
                        include: {
                            model: db.USER,
                            attributes: ["ID", "FULLNAME", "USERNAME", "AVATAR", "EMAIL"],
                            required: true,
                        },
                        attributes: ["ID", "POST_ID", "CONTENT", "COMMENT_REPLIED_TO", "createdAt"]
                        // required: true,
                    },
                    {
                        model: db.USER,
                        attributes: ["ID", "FULLNAME", "USERNAME", "AVATAR", "EMAIL"],
                        required: true,
                    },
                ],
                where: {
                    POST_ID: post_id,
                    COMMENT_REPLIED_TO: {
                        [Op.eq]: null
                    }
                },
                attributes: ["ID", "POST_ID", "CONTENT", "createdAt"]
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    comments: result
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
    async getPostByUser(userId, crrUser) {
        try {
            const result = await db.POST.findAll({
                include: [
                    {
                        model: db.POST_IMAGE,
                        required: true,
                        attributes: ["ID", "IMAGE"]
                    },
                    {
                        model: db.USER,
                        required: true,
                        attributes: [
                            "ID",
                            "USERNAME",
                            "FULLNAME",
                            "AVATAR",
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
                            ]
                        ]
                    }
                ],
                where: {
                    CREATED_BY_USER_ID: userId
                },
                attributes: [
                    "ID",
                    "CAPTION",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" GROUP BY "POST"."ID"), 0)`),
                        'LIKES',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("COMMENT"."POST_ID") FROM "COMMENT" WHERE "COMMENT"."POST_ID" = "POST"."ID" GROUP BY "POST"."ID"), 0)`),
                        'COMMENTS',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" AND "LIKE"."USER_ID" = '${crrUser}' GROUP BY "POST"."ID"), 0)`),
                        'ISLIKED',
                    ],
                    "createdAt",
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    newFeeds: result
                }
            }
        } catch (error) {
            console.log(error);
            return {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: "",
                result: null
            }
        }
    }
    async updatePost(id, caption, images, deletedImages) {

        try {
            await sequelize.transaction(async t => {
                const post = await db.POST.findByPk(id)
                post.CAPTION = caption
                await db.POST_IMAGE.destroy({
                    where: {
                        ID: deletedImages
                    }
                })
                await db.POST_IMAGE.bulkCreate(images, { transaction: t })
                await post.save()
            })
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
    async deletePost(id) {
        try {
            await sequelize.transaction(async t => {
                await db.POST_IMAGE.destroy({
                    where: {
                        POST_ID: id
                    }
                })
                await db.COMMENT.destroy({
                    where: {
                        POST_ID: id
                    }
                })
                await db.LIKE.destroy({
                    where: {
                        POST_ID: id
                    }
                })
                await db.NOTIFICATION.destroy({
                    where: {
                        POST_ID: id
                    }
                })
                await db.POST.destroy({
                    where: {
                        ID: id
                    }
                })

            })
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

}

module.exports = new postServices