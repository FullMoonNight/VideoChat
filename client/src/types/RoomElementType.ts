import {UserElementType} from "./UserElementType";

export interface RoomElementType {
    roomId: string,
    name: string,
    owner: string,
    chat?: string,
    editors: {
        text: boolean,
        handWr: boolean
    }
    roomImageId: string,
    confirm: boolean,
    roomMembers: UserElementType[]
}