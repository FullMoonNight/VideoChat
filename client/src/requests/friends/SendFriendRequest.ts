import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface SendFriendParams extends Params {
    userId: string
}

export class SendFriendRequest extends BaseRequest<null> {
    method: MethodType = 'post'
    parameters: SendFriendParams
    route: string = '/friends/sendFriendRequest'

    constructor(parameters: SendFriendParams) {
        super();
        this.parameters = parameters
    }
}