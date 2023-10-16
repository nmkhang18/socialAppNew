const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')

class middleware {
    async isValidMember(req, res, next) {
        try {
            const result = await sequelize.query(`SELECT 1
                                                    FROM public."USER_CONVERSATION"
                                                    WHERE "USER_ID" = '${req.user._id}' AND "CONVERSATION_ID" = '${req.params.conversationId}'`, {
                nest: true,
                type: Sequelize.QueryTypes.SELECT
            });
            if (result.length == 0) {
                return res.json({
                    messege: 'Invalid member of conversation'
                })
            }
            next()
        } catch (error) {
            console.log(error.message);
            return res.json({
                messege: 'Invalid member of conversation'
            })
        }
    }
    async checkConversation(req, res, next) {
        try {

            const result = await sequelize.query(`SELECT "P"."CONVERSATION_ID" AS "CONVERSATION_ID"
                                                    FROM
                                                    ((SELECT "ID", "USER_ID", "CONVERSATION_ID"
                                                    FROM public."USER_CONVERSATION"
                                                    WHERE "USER_ID" = '${req.params.id}') AS "P" 
                                                    INNER JOIN 
                                                    (SELECT "ID", "USER_ID", "CONVERSATION_ID"
                                                    FROM public."USER_CONVERSATION"
                                                    WHERE "USER_ID" = '${req.user._id}') AS "K"
                                                    ON "P"."CONVERSATION_ID" = "K"."CONVERSATION_ID")`, {
                nest: true,
                type: Sequelize.QueryTypes.SELECT
            });
            if (result.length != 0) {
                return res.redirect(`/api/messege/${result[0].CONVERSATION_ID}?page=0&offset=0`)
            }
            next()

        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new middleware