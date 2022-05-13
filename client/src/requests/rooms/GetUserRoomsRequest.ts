import BaseRequest from "../BaseRequest";
import {RoomElementType} from "../../types/RoomElementType";

interface GetUserRoomsResponse extends RoomElementType {
}

export default class GetUserRoomsRequest extends BaseRequest<GetUserRoomsResponse[]> {
    route: string = '/user_rooms'
}