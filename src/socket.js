const jwt = require('jsonwebtoken')
const db = require('./models/index')
const { sequelize } = require('./models/index')


const authenMiddleware = async (socket, next) => {
    console.log("Authen");
    if (socket.handshake.query?.accessToken) {
        const token = socket.handshake.query.accessToken;
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET)
            await db.USER_SOCKET.create({
                USER_ID: verified._id,
                SOCKET_ID: socket.id
            })
            next()
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('token not found');
        next(new Error('Authentication error'));
    }
};

const SocketServer = (socket) => {
    socket.on('disconnect', async () => {
        try {
            const crrSocket = await db.USER_SOCKET.findOne({
                where: {
                    SOCKET_ID: socket.id
                }
            })
            await crrSocket.destroy()
        } catch (error) {
            console.log(error);
            console.log("failed on disconect");
        }
    })
}

module.exports = { SocketServer, authenMiddleware }