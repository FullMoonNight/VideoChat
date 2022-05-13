import {Socket} from "socket.io-client";

export function connectionListeners(socket: Socket) {
    socket.on('START_CONNECTION', ({roomId}) => {
        console.log(`[connection] room ${roomId} was created, connecting starts`)
    })
}