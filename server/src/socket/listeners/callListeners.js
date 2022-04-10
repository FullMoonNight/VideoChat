module.exports.callListeners = function callListeners(socket, socketInterface) {
    const io = socketInterface.ioMain
    const usersMap = socketInterface.usersMap

    socket.on('CREATE_ROOM', ({roomId}) => {
        if(io.sockets.adapter.rooms.get(roomId)) return console.log(`room ${roomId} already exist`)
        socket.join(roomId)
    })

    socket.on('INVITE_USERS', ({usersList, roomId}) => {
        let userSocketsId = []
        usersList.forEach(userId => {
            const currentUserSocketsId = usersMap[userId]
            userSocketsId = userSocketsId.concat(currentUserSocketsId)
        })
        userSocketsId.forEach(socketId => {
            io.to(socketId).emit('INVITE_REQUEST', {roomId})
        })
    })

    socket.on('JOIN_ROOM', ({userId, roomId}) => {
        const userSocketsInRoom = [...io.sockets.adapter.rooms.get(roomId)]
        const userSockets = usersMap[userId]
        if (!userSockets.length) return console.log(`user ${userId} in not connected to WS server`)

        for (const userSocketsKey of userSockets) {
            if (userSocketsInRoom.includes(userSocketsKey)) return console.log(`user ${userId} already in room ${roomId}`)

        }
        socket.join(roomId)
        socket.emit('START_CONNECTION', {roomId})
    })
}