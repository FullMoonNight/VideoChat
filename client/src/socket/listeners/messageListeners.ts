import {Socket} from "socket.io-client";

export function messageListeners(socket: Socket) {
    socket.on('INVITE_REQUEST', ({roomId}: { roomId: string }) => {

    })

    socket.on('START_CONNECTION', ({roomId}: { roomId: string }) => {

    })
}