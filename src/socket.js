const jwt = require('jsonwebtoken')

let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item =>
        item.id === id ? { ...item, call } : item
    )
    return newData;
}

const SocketServer = (socket) => {
    // Connect - Disconnect
    socket.on('joinUser', token => {
        try {
            const user = jwt.verify(token, process.env.TOKEN_SECRET)
            users.push({ id: user._id, socketId: socket.id, followers: JSON.parse(user.followers), username: user.username })
            console.log(users);
        } catch (error) {
            console.log(error.name);
        }
    })

    socket.on('disconnect', () => {
        try {
            users = users.filter(user => user.socketId !== socket.id)
            console.log(users);
        } catch (error) {
            console.log(error);
            console.log(error.name);
        }
    })


    // Likes
    socket.on('likePost', newPost => {
        try {
            const receive = users.find(e => e.id == newPost.USER.ID)
            const send = users.find(e => e.socketId == socket.id)
            if (receive) {
                const ids = [...receive.followers, receive.id]
                console.log(ids);
                const clients = users.filter(user => ids.includes(user.id))
                if (clients.length > 0) {
                    clients.forEach(client => {
                        if (client.id == newPost.USER.ID) {
                            socket.to(`${client.socketId}`).emit('notify', `${send.username} likes your post`)
                        }
                        socket.to(`${client.socketId}`).emit('likeToClient', newPost)
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('follow', flId => {
        try {
            const findH = users.filter(e => e.id == flId)
            const findS = users.find(e => e.socketId == socket.id)
            if (findH.length > 0) {
                findH.forEach(e => {
                    socket.to(`${e.socketId}`).emit('notify', `${findS.username} has followed you`)
                })
            }
        } catch (error) {
            console.log(error.name);
        }
    })

    socket.on('unLikePost', newPost => {
        try {
            const findH = users.find(e => e.id == newPost.USER.ID)
            if (findH) {
                const ids = [...findH.followers, newPost.USER.ID]
                const clients = users.filter(user => ids.includes(user.id))
                console.log(newPost);
                if (clients.length > 0) {
                    clients.forEach(client => {
                        socket.to(`${client.socketId}`).emit('unlikeToClient', newPost)
                    })
                }
            }
        } catch (error) {
            console.log(error.name);
        }
    })


    // Comments
    socket.on('createComment', newPost => {
        try {
            const receive = users.find(e => e.id == newPost.USER.ID)
            const send = users.find(e => e.socketId == socket.id)
            if (receive) {
                const ids = [...receive.followers, receive.id]
                console.log(ids);
                const clients = users.filter(user => ids.includes(user.id))
                if (clients.length > 0) {
                    clients.forEach(client => {
                        if (client.id == newPost.USER.ID) {
                            socket.to(`${client.socketId}`).emit('notify', `${send.username} comments your post`)
                        }
                        socket.to(`${client.socketId}`).emit('commentToClient', newPost)
                    })
                }
            }
        } catch (error) {
            console.log(error.name);
        }
    })



    // Message
    socket.on('addMessege', msg => {
        try {
            // const userReceive = users.find(user => users.id === msg.RECEIVE_USER_ID)
            const userSend = users.find(user => user.id === msg.SEND_USER_ID)
            const userReceive = users.filter(user => user.id === msg.RECEIVE_USER_ID)
            console.log(userReceive);
            if (userReceive.length > 0) {
                userReceive.forEach(e => {
                    socket.to(`${e.socketId}`).emit('messegeToClient', msg)
                    socket.to(`${e.socketId}`).emit('notify', `${userSend.username} sent you messege`)
                })

            }
        } catch (error) {
            console.log(error.name);
        }
    })


    // Check User Online / Offline
    socket.on('checkUserOnline', data => {
        const following = users.filter(user =>
            data.following.find(item => item._id === user.id)
        )
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user =>
            data.followers.find(item => item._id === user.id)
        )

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }

    })


}

module.exports = SocketServer