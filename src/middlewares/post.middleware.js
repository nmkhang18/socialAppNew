const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')

class middleware {
    async isAuthor(req, res, next) {
        try {
            const result = await sequelize.query(`SELECT 1
                                                    FROM public."POST"
                                                    WHERE "CREATED_BY_USER_ID" = '${req.user._id}' AND "ID" = '${req.params.id}'`, {
                nest: true,
                type: Sequelize.QueryTypes.SELECT
            });
            if (result.length == 0) {
                return res.json({
                    messege: 'Invalid author'
                })
            }
            next()
        } catch (error) {
            console.log(error.message);
            return res.json({
                messege: 'Invalid author'
            })
        }
    }
}

module.exports = new middleware