const { google } = require('googleapis')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN

var connectMailer = (function () {
    var instance;
    function init() {
        const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
        return oauth2Client
    }

    return {
        getInstance: function () {
            if (!instance) instance = init();
            return instance;
        }
    }
})();
module.exports = { connectMailer }