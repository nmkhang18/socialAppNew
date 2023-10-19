const { connectMailer } = require('../configs/mailerConfig')
const { connectDrive } = require('../configs/uploadDrive')
const stream = require("stream")
const nodemailer = require('nodemailer')
const OtpGenerator = require('otp-generator')
const bcrypt = require('bcryptjs')



createId = () => {
    var today = new Date();
    return `${today.getFullYear()}${today.getMonth()}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}${today.getMilliseconds()}`

}
otpTimeOut = (min) => {
    let expire = new Date()
    expire.setTime(expire.getTime() + min * 60 * 1000)
    return `${expire.getFullYear()}-${expire.getMonth() + 1}-${expire.getDate()} ${expire.getHours()}:${expire.getMinutes()}:${expire.getSeconds()}`
}
sendEmail = async (toEmail, otp) => {
    try {

        const oauthClient = connectMailer.getInstance()
        const accessToken = await oauthClient.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'cuahanggiaydepstorage@gmail.com',
                clientId: oauthClient._clientId,
                clientSecret: oauthClient._clientSecret,
                refreshToken: oauthClient.credentials.refresh_token,
                accessToken: accessToken,
            }
        })
        let info = await transport.sendMail({
            from: '"PTIT Social App" <cuahanggiaydepstorage@gmail.com>', // sender address
            to: `${toEmail}`, // list of receivers
            subject: 'Sign up for PTIT Social App',
            text: `Your OTP is: ${otp}`, // plain text body
            html: `<b>Your OTP is: </b> ${otp}`, // html body
        });
        if (!info.accepted) {
            return 1
        }
        return 0

    } catch (error) {
        console.log(error.message);
        return 0
    }
}

uploadDrive = async (fileIn) => {
    try {
        const drive = connectDrive.getInstance()
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileIn);
        const createFile = await drive.files.create({
            requestBody: {
                name: `${this.createId}.jpg`,
                mimeType: "image/jpg"
            },
            media: {
                mimeType: 'image/jpg',
                body: bufferStream
            }
        })
        const fileId = createFile.data.id

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        return "https://drive.google.com/uc?export=view&id=" + fileId
    } catch (error) {
        console.log(error.message);
        return 0
    }
}
generateOTP = async () => {
    const otp = await OtpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    })
    const salt = await bcrypt.genSaltSync(10)
    const hashOtp = await bcrypt.hash(otp, salt)
    return {
        otp,
        hashOtp
    }
}

module.exports = { createId, otpTimeOut, sendEmail, uploadDrive, generateOTP }