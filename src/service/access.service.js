const db = require('../models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const otpSchema = require('../models/otpServices/otp')
const { otpTimeOut, sendEmail, generateOTP } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createId } = require('../helpers/helpers')
const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require('http-status-codes')

class accessServices {
    async signIn({ email, password }) {
        try {
            const user = await db.USER.findOne({
                where: {
                    [Op.or]: [
                        { USERNAME: email },
                        { EMAIL: email }
                    ]
                }
            })
            if (!user) return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: 'Email does not exist',
                result: null
            }
            if (user.TRANGTHAI == false) return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: 'Account banned',
                result: null
            }
            if (!bcrypt.compareSync(password, user.PASSWORD)) return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: 'Incorrect password',
                result: null
            }
            const token = jwt.sign({ _id: user.ID, exp: Math.floor(Date.now() / 1000 + (60 * parseInt(process.env.TOKEN_TIME))) }, process.env.TOKEN_SECRET)
            return {
                code: StatusCodes.ACCEPTED,
                status: ReasonPhrases.ACCEPTED,
                message: "",
                result: { token }
            }
        } catch (error) {
            return {
                code: StatusCodes.SERVICE_UNAVAILABLE,
                status: ReasonPhrases.SERVICE_UNAVAILABLE,
                message: error.message,
                result: null
            }
        }
    }
    async signUp({ username, fullname, email, password, gender, address, mobile, otp }) {
        try {
            const checkOTP = await otpSchema.find({ email }).lean()

            if (!bcrypt.compareSync(otp, checkOTP[checkOTP.length - 1] ? checkOTP[checkOTP.length - 1].otp : "  ")) return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: "Incorrect OTP or expired",
                result: null
            }
            const checkUser = await db.USER.findOne({
                where: {
                    [Op.or]: [
                        { USERNAME: username },
                        { EMAIL: email },
                        { MOBILE: mobile }
                    ]
                },
                attributes: ["USERNAME", "EMAIL", "MOBILE"]
            })
            if (checkUser) return {
                code: StatusCodes.CONFLICT,
                status: ReasonPhrases.CONFLICT,
                message: "",
                result: {
                    username: username == checkUser.USERNAME ? username : null,
                    email: email == checkUser.EMAIL ? email : null,
                    mobile: mobile == checkUser.MOBILE ? mobile : null,
                }
            }
            const salt = await bcrypt.genSaltSync(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const result = await db.USER.create({
                ID: createId(),
                USERNAME: username,
                FULLNAME: fullname,
                EMAIL: email,
                PASSWORD: hashPassword,
                GENDER: gender,
                ADDRESS: address,
                MOBILE: mobile
            })
            return {
                code: StatusCodes.CREATED,
                status: ReasonPhrases.CREATED,
                message: "Success",
                result: {
                    user: { email: result.EMAIL }
                }
            }
        } catch (error) {
            return {
                code: StatusCodes.SERVICE_UNAVAILABLE,
                status: ReasonPhrases.SERVICE_UNAVAILABLE,
                message: error.message,
                result: null
            }
        }
    }
    async verifyOTP({ email, otp }) {
        try {

        } catch (error) {

        }
    }
    async getOTP({ email }, type) {
        try {
            const checkMail = await db.USER.findOne({
                where: {
                    EMAIL: email
                }
            })
            if (checkMail && type == "regist") return {
                code: StatusCodes.CONFLICT,
                status: ReasonPhrases.CONFLICT,
                message: "Email existed",
                result: null
            }
            else if (!checkMail && type == "forget") return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: "Email not existed",
                result: null
            }
            const optDetail = await generateOTP()
            await otpSchema.create({
                email: email,
                otp: optDetail.hashOtp,
            })
            console.log(optDetail);
            // sendSMS(optDetail.otp, phone)
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "OTP sent",
                result: null
            }
        } catch (error) {
            return {
                code: StatusCodes.SERVICE_UNAVAILABLE,
                status: ReasonPhrases.SERVICE_UNAVAILABLE,
                message: error.message,
                result: null
            }
        }
    }
    async savePassword({ email, password }) {
        try {
            const checkOTP = await otpSchema.find({ email }).lean()

            if (!bcrypt.compareSync(otp, checkOTP[checkOTP.length - 1] ? checkOTP[checkOTP.length - 1].otp : "  ")) return {
                code: StatusCodes.NON_AUTHORITATIVE_INFORMATION,
                status: ReasonPhrases.NON_AUTHORITATIVE_INFORMATION,
                message: "Incorrect OTP or expired",
                result: null
            }
            const result = await db.USER.findOne({
                where: {
                    EMAIL: email
                }
            })
            const salt = await bcrypt.genSaltSync(10)
            const hashPassword = await bcrypt.hash(password, salt)
            result.PASSWORD = hashPassword
            await result.save()
            return {
                code: StatusCodes.OK,
                status: ReasonPhrases.OK,
                message: "",
                result: {
                    user: { email: result.EMAIL }
                }
            }
        } catch (error) {
            return {
                code: StatusCodes.SERVICE_UNAVAILABLE,
                status: ReasonPhrases.SERVICE_UNAVAILABLE,
                message: error.message,
                result: null
            }
        }
    }
}

module.exports = new accessServices