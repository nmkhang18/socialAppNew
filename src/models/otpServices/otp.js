const { Schema, model } = require('mongoose')

const otpSchema = new Schema({
    email: String,
    otp: String,
    create_1: { type: Date, default: Date.now, index: { expires: 3600 } }
}, {
    collection: 'otp'
})

module.exports = model('otp', otpSchema)