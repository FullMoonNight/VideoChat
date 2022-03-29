import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface RejectFriendParams extends Params {
    userId: string
}

export class RejectFriendRequest extends BaseRequest<null> {
    method: MethodType = 'post'
    parameters: RejectFriendParams
    route: string = '/friends/rejectFriendRequest'

    constructor(parameters: RejectFriendParams) {
        super();
        this.parameters = parameters
    }
}