const OtpGenerator = require('otp-generator')
const bcrypt = require('bcryptjs')
const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const { otpTimeOut } = require('../helpers/helpers')
const { sendMail } = require('../configs/mailerConfig')


class otpService {
    insertOtp = async ({
        email,
        otp
    }) => {
        try {
            const salt = await bcrypt.genSaltSync(10)
            const hashOtp = await bcrypt.hash(otp, salt)
            let result = await db.OTP.findByPk(email)
            if (result) {
                result.VALUE = hashOtp
                result.THOIHAN = otpTimeOut(2)
                await result.save()
                sendMail(email, otp)
                return 1
            }

            let saveOTP = await db.OTP.create({
                EMAIL: email,
                VALUE: hashOtp,
                THOIHAN: otpTimeOut(2),
            })
            sendMail(email, otp)
            return saveOTP ? 1 : 0

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new otpService