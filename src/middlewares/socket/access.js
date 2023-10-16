import jwt from 'jsonwebtoken';

const authenMiddleware = (socket, next) => {
    console.log('Authen...');
    if (socket.handshake.query?.token) {
        const token = socket.handshake.query.token;
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET)

            next()
        } catch (error) {
            next(new Error('authen failed'));
        }
    } else {
        console.log('token not found');
        next(new Error('Authentication error'));
    }
};

module.exports = authenMiddleware