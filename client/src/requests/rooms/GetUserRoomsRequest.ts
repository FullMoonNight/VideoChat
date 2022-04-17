import BaseRequest from "../BaseRequest";
import {Params} from "../../http/RequestInterface";
import {RoomElementType} from "../../types/RoomElementType";

interface GetUserRoomsResponse extends RoomElementType {
}

export default class GetUserRoomsRequest extends BaseRequest<GetUserRoomsResponse[]> {
    route: string = '/user_rooms'
}