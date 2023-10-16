const Joi = require('joi')

class valadator {
    updateUser(data) {
        const schema = Joi.object({
            username: Joi.string().min(6).required(),
            fullname: Joi.string().min(6).required(),
            address: Joi.string().min(6),
            description: Joi.string().empty(),
            mobile: Joi.string().length(10).pattern(/^[0-9]+$/),
            gender: Joi.string().min(3).required(),
        })
        return schema.validate(data)
    }
    changePassword(data) {
        const schema = Joi.object({
            password: Joi.string().min(3).required(),
            n_password: Joi.string().min(3).required(),
            re_password: Joi.ref('n_password'),
        })
        return schema.validate(data)
    }
}

module.exports = new valadator