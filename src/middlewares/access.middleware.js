const jwt = require('jsonwebtoken')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')

class middleware {
    login(req, res, next) {
        const token = req.header('accessToken')
        if (!token) return res.json({
            message: 'Token required'
        })

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET)
            req.user = verified
            next()
        } catch (error) {
            console.log(error.name);
            return res.json({
                message: error.name
            })
        }
    }
    checkId(req, res, next) {
        if (req.params.id != req.user._id) return res.json({ message: 'You are not this user' })
        next()
    }
}

module.exports = new middleware