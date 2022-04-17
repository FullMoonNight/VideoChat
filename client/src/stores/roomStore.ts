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
        console.log(toJS(this.rooms))
    }
}

const roomStore = new RoomStore()
export {roomStore}