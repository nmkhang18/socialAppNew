const { Schema, model } = require('mongoose')

const otpSchema = new Schema({
    email: String,
    otp: String,
    create: { type: Date, default: Date.now, index: { expires: 120 } }
}, {
    collection: 'otp'
})

module.exports = model('otp', otpSchema)