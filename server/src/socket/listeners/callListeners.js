module.exports.callListeners = function callListeners(socket, socketInterface) {
    const io = socketInterface.ioMain
    const usersMap = socketInterface.usersMap

    //пока не нужно использовать
    socket.on('CREATE_ROOM', ({roomId}) => {
        if (io.sockets.adapter.rooms.get(roomId)) return console.log(`room ${roomId} already exist`)
        socket.join(roomId)
        socket.emit('ROOM_CREATED', {roomId})
    })

    //пока не нужно использовать
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
        let userSocketsInRoom
        try {
            userSocketsInRoom = [...io.sockets.adapter.rooms.get(roomId)]
        } catch (e) {
            return socket.join(roomId)
        }
        const userSockets = usersMap[userId]
        if (userSockets && !userSockets.length) return console.log(`user ${userId} in not connected to WS server`)

        for (const userSocketsKey of userSockets) {
            if (userSocketsInRoom.includes(userSocketsKey)) return console.log(`user ${userId} already in room ${roomId}`)
        }

        userSocketsInRoom.forEach(socketId => {
            io.to(socketId).emit('ADD_PEER', {
                peerId: socket.id,
                userId: socket._userId,
                createOffer: false
            })

            socket.emit('ADD_PEER', {
                peerId: socketId,
                userId: io.sockets.sockets.get(socketId)._userId,
                createOffer: true
            })
        })

        socket.join(roomId)
        socket.emit('START_CONNECTION', {roomId})
    })

    socket.on('RELAY_SDP', ({peerId, sessionDescription}) => {
        io.to(peerId).emit('SESSION_DESCRIPTION', {
            peerId: socket.id,
            sessionDescription
        })
    })

    socket.on('RELAY_ICE', ({peerId, iceCandidate}) => {
        io.to(peerId).emit('ICE_CANDIDATE', {
            peerId: socket.id,
            iceCandidate
        })
    })

    function leaveRoom() {
        const rooms = [...socket.rooms].filter(id => id !== socket.id)
        rooms.forEach(roomId => {
            const socketsInRooms = [...io.sockets.adapter.rooms.get(roomId)].filter(socketId => socketId !== socket.id)
            socketsInRooms.forEach(socketId => {
                io.to(socketId).emit('REMOVE_PEER', {
                    peerId: socket.id
                })

                socket.emit('REMOVE_PEER', {
                    peerId: socketId
                })
            })
            socket.leave(roomId)
        })
    }

    socket.on('disconnecting', leaveRoom)
    socket.on('LEAVE', leaveRoom)
}