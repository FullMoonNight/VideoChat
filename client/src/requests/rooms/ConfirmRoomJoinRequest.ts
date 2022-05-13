import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface ConfirmRoomParams extends Params {
    roomId: string
}

export class ConfirmRoomJoinRequest extends BaseRequest<any> {
    method: MethodType = 'post'
    route: string = '/user_rooms/confirm'
    parameters: ConfirmRoomParams

    constructor(parameters: ConfirmRoomParams) {
        super();
        this.parameters = parameters
    }
}