import {action, makeAutoObservable, toJS} from "mobx";
import {RoomElementType} from "../types/RoomElementType";


class RoomStore {
    rooms: RoomElementType[]

    constructor() {
        this.rooms = []
        makeAutoObservable(this)
    }

    @action
    setRooms(rooms: RoomElementType[]) {
        this.rooms = rooms
    }

    @action
    updateRoom(room: RoomElementType) {
        this.rooms = this.rooms.map(r => r.roomId === room.roomId ? room : r)
    }
}

const roomStore = new RoomStore()
export {roomStore}