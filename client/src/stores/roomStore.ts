import {action, makeAutoObservable} from "mobx";

interface Room {
    room_id: string,
    name: string,
    owner: string,
    roomImageId: string
}

class RoomStore {
    rooms: Room[]

    constructor() {
        this.rooms = [
            {
                room_id: '14a7e7f1-0ca6-450d-84dc-f5f481613817',
                owner: '0080530d-92ea-401c-af64-e66b02c6fb46',
                roomImageId: '',
                name: 'test-room'
            },
            {
                room_id: '14a7e7f1-0cfd6-450d-84dc-f5f481613817',
                owner: '0080530d-92ea-401c-af64-e66b02c6fb46',
                roomImageId: '',
                name: 'test-room'
            },
            {
                room_id: '14a7e7f1-0c36-450d-84dc-f5f481613817',
                owner: '0080530d-92ea-401c-af64-e66b02c6fb46',
                roomImageId: '',
                name: 'test-room'
            },
            {
                room_id: '14a7e7f1-0ca6-4gf0d-84dc-f5f481613817',
                owner: '0080530d-92ea-401c-af64-e66b02c6fb46',
                roomImageId: '',
                name: 'test-room'
            },
        ]
        makeAutoObservable(this)
    }

    @action
    setRooms(rooms: Room[]) {
        this.rooms = rooms
    }
}

const roomStore = new RoomStore()
export {roomStore}