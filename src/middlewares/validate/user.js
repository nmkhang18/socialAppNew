const UserSchemaValidation = require('../../validations/user.validator')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')

class userValidator {
    static updateUser = (req, res, next) => {
        const { error } = UserSchemaValidation.updateUser(req.body)
        if (error) return res.json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }
    static changePassword = (req, res, next) => {
        const { error } = UserSchemaValidation.changePassword(req.body)
        if (error) return res.json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }
    static updateAvatar = (req, res, next) => {
        if (!req.files.file) return res.json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: "image required",
            result: null
        })
        next();
    }
}

module.exports = userValidator