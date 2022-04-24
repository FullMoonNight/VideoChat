import BaseRequest from "../BaseRequest";
import {RoomElementType} from "../../types/RoomElementType";
import {Params} from "../../http/RequestInterface";

export interface GetRoomInfoParams extends Params {
    roomId: string
}

export class GetRoomInfoRequest extends BaseRequest<RoomElementType> {
    route: string = '/user_rooms/room_info'
    parameters: GetRoomInfoParams

    constructor(parameters: GetRoomInfoParams) {
        super();
        this.parameters = parameters
    }
}