import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface AcceptFriendParams extends Params {
    userId: string
}

export class AcceptFriendRequest extends BaseRequest<null> {
    method: MethodType = 'post'
    parameters: AcceptFriendParams
    route: string = '/friends/acceptFriendRequest'

    constructor(parameters: AcceptFriendParams) {
        super();
        this.parameters = parameters
    }
}