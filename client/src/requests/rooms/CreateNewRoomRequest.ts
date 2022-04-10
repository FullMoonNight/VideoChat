import BaseRequest from "../BaseRequest";
import {Params} from "../../http/RequestInterface";

export interface CreateNewRoomParams extends Params{
    userId: string
}

interface CreateNewRoomResponse{
    roomId: string
}

export default class CreateNewRoomRequest extends BaseRequest<CreateNewRoomResponse>{
    route: string = '/user_rooms/create_room'
    parameters: CreateNewRoomParams

    constructor(parameters: CreateNewRoomParams) {
        super();
        this.parameters = parameters
    }
}