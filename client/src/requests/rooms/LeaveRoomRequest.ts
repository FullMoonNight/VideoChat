import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface LeaveRoomParams extends Params{
    roomId: string
}

export class LeaveRoomRequest extends BaseRequest<any>{
    method: MethodType = 'post'
    route: string = '/user_rooms/leave'
    parameters: LeaveRoomParams

    constructor(parameters: LeaveRoomParams) {
        super();
        this.parameters = parameters
    }
}