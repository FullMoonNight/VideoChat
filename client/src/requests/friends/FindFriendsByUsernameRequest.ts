import BaseRequest from "../BaseRequest";
import {Params} from "../../http/RequestInterface";
import {FriendElementType} from "../../types/FriendElementType";

export interface FindUsersParams extends Params {
    usernamePart: string
}

interface FindUsersResponse extends FriendElementType{
}

export class FindFriendsByUsernameRequest extends BaseRequest<FindUsersResponse[]> {
    route: string = '/friends/users'
    parameters: FindUsersParams

    constructor(parameters: FindUsersParams) {
        super();
        this.parameters = parameters
    }
}