import CreateNewRoomRequest, {CreateNewRoomParams} from "../requests/rooms/CreateNewRoomRequest";
import GetUserRoomsRequest from "../requests/rooms/GetUserRoomsRequest";
import MessageController from "./MessageController";
import {roomStore} from "../stores/roomStore";
import {ConfirmRoomJoin, ConfirmRoomParams} from "../requests/rooms/ConfirmRoomJoin";
import {LeaveRoomParams, LeaveRoomRequest} from "../requests/rooms/LeaveRoomRequest";
import {Controller} from "@react-spring/web";
import {GetRoomInfoParams, GetRoomInfoRequest} from "../requests/rooms/GetRoomInfoRequest";

export default class RoomController {
    //todo добавить метод, для загрузки одной комнаты и изменить обновление
    // данных при подтверждении комнаты и при создании новой на точечное

    static async createNewRoom(params: CreateNewRoomParams) {
        const command = new CreateNewRoomRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            MessageController.success(`New room '${result.data.roomName}' has been created`)
            await this.getUserRooms()
        }
    }

    static async getUserRooms() {
        const command = new GetUserRoomsRequest()
        const result = await command.execute()

        if (result.status === 200) {
            roomStore.setRooms(result.data)
        }
    }

    static async getRoomInfo(params: GetRoomInfoParams) {
        const command = new GetRoomInfoRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            roomStore.updateRoom(result.data)
        }
    }

    static async confirmJoinRoom(params: ConfirmRoomParams) {
        const command = new ConfirmRoomJoin(params)
        const result = await command.execute()

        if (result.status === 200) {
            await this.getUserRooms()
        } else if (result.response) {
            MessageController.error(result.response.data.message)
        }
    }

    static async leaveRoom(params: LeaveRoomParams) {
        const command = new LeaveRoomRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            await this.getUserRooms()
        } else if (result.response) {
            MessageController.error(result.response.data.message)
            throw new Error(result.response.data.message)
        }
    }
}