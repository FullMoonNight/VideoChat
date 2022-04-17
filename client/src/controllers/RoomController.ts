import CreateNewRoomRequest, {CreateNewRoomParams} from "../requests/rooms/CreateNewRoomRequest";
import GetUserRoomsRequest from "../requests/rooms/GetUserRoomsRequest";
import MessageController from "./MessageController";
import {roomStore} from "../stores/roomStore";

export default class RoomController {
    static async createNewRoom(params: CreateNewRoomParams) {
        const command = new CreateNewRoomRequest(params)
        const result = await command.execute()

        console.log(result)
        if (result.status === 200) {
            MessageController.success(`New room '${result.data.roomName}' has been created`)
            await this.getUserRooms()
        }
    }

    static async getUserRooms() {
        const command = new GetUserRoomsRequest()
        const result = await command.execute()

        console.log(result)
        if (result.status === 200) {
            roomStore.setRooms(result.data)
        }
    }
}