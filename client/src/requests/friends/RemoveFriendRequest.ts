import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface RemoveFriendParams extends Params {
    userId: string
}

export class RemoveFriendRequest extends BaseRequest<any> {
    method: MethodType = 'post'
    route: string = '/friends/removeFriend'
    parameters: RemoveFriendParams

    constructor(parameters: RemoveFriendParams) {
        super();
        this.parameters = parameters
    }
}