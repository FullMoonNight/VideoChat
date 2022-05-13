import {Socket} from "socket.io-client";
import RoomController from "../../controllers/RoomController";

export function roomListeners(socket: Socket) {
    socket.on('ADDED_NEW_ROOM', ({roomId}: { roomId: string }) => {
        RoomController.getUserRooms()
    })

    socket.on('UPDATE_ROOM_DATA', ({roomId}: { roomId: string }) => {
        RoomController.getRoomInfo({roomId})
    })
}