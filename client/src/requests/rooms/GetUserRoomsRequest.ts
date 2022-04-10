import BaseRequest from "../BaseRequest";
import {Params} from "../../http/RequestInterface";

export interface GetUserRoomsParam extends Params {
    userId: string
}

interface GetUserRoomsResponse {
    rooms: {
        room_id: string,
        name: string,
        owner: string,
        roomImageId: string
    }[]
}

export default class GetUserRoomsRequest extends BaseRequest<GetUserRoomsResponse> {
    route: string = '/user_rooms'
    parameters: GetUserRoomsParam

    constructor(parameters: GetUserRoomsParam) {
        super();
        this.parameters = parameters
    }
}