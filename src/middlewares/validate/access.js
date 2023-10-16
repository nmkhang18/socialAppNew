const AccessSchemaValidation = require('../../validations/access.validator')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')

class accessValidator {
    static getOTP = (req, res, next) => {
        const { error } = AccessSchemaValidation.getOTP(req.body)
        if (error) return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }
    static verifyOTP = (req, res, next) => {
        const { error } = AccessSchemaValidation.verifyOTP(req.body)
        if (error) return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }
    static signUp = (req, res, next) => {
        const { error } = AccessSchemaValidation.signUp(req.body)
        if (error) return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }
    static signIn = (req, res, next) => {
        const { error } = AccessSchemaValidation.signIn(req.body)
        if (error) return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }
    static resetPassword = (req, res, next) => {
        const { error } = AccessSchemaValidation.resetPassword(req.body)
        if (error) return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            code: StatusCodes.NOT_ACCEPTABLE,
            status: ReasonPhrases.NOT_ACCEPTABLE,
            message: error.message,
            result: null
        })
        next();
    }

}

module.exports = accessValidator