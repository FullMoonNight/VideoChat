import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface CreateNewRoomParams extends Params {
    userId: string,
    room: {
        roomName: string,
        includedUsersId: string[],
        handWrEditor: boolean,
        textEditor: boolean,
        chat: boolean
    }
}

interface CreateNewRoomResponse {
    roomId: string,
    roomName: string,
}

export default class CreateNewRoomRequest extends BaseRequest<CreateNewRoomResponse> {
    route: string = '/user_rooms/create_room'
    method: MethodType = "post"
    parameters: CreateNewRoomParams

    constructor(parameters: CreateNewRoomParams) {
        super();
        this.parameters = parameters
    }
}