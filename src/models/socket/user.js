const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    user_id: String,
    socket_id: collection,
}, {
    collection: 'otp'
})

module.exports = model('otp', userSchema)