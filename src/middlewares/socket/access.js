import jwt from 'jsonwebtoken';

const authenMiddleware = (socket, next) => {
    console.log('Authen...', socket.handshake.query);
    if (socket.handshake.query?.token !== "") {
        const token = socket.handshake.query.token;
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET)

            next()
        } catch (error) {
            console.log(error);
            return
        }
    } else {
        console.log('Token not found');
        return
        // next(new Error('Authentication error'));
    }
};

module.exports = authenMiddleware