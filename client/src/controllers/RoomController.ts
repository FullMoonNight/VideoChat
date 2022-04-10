import CreateNewRoomRequest, {CreateNewRoomParams} from "../requests/rooms/CreateNewRoomRequest";
import GetUserRoomsRequest, {GetUserRoomsParam} from "../requests/rooms/GetUserRoomsRequest";

export default class RoomController {
    static async createNewRoom(params: CreateNewRoomParams) {
        const command = new CreateNewRoomRequest(params)
        const result = await command.execute()

        console.log(result)
    }

    static async getUserRooms(params: GetUserRoomsParam) {
        const command = new GetUserRoomsRequest(params)
        const result = await command.execute()

        console.log(result)
    }
}