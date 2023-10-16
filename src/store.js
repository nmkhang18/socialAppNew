const usersOnline = {}

const online = (socket, user) => {
    if (usersOnline[user._id]) usersOnline[user._id].push(socket.id)
    else usersOnline[user._id] = [socket.id]
}