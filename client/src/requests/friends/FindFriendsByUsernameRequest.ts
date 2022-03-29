import BaseRequest from "../BaseRequest";
import {Params} from "../../http/RequestInterface";

export interface FindUsersParams extends Params {
    usernamePart: string
}

interface FindUsersResponse {
    linkId: string,
    user: {
        userId: string,
        userImageId: string,
        username: string,
        status?: 'active' | 'sleep' | 'invisible'
    }
    status: "friends" | "pending" | "request"
}

export class FindFriendsByUsernameRequest extends BaseRequest<FindUsersResponse[]> {
    route: string = '/friends/users'
    parameters: FindUsersParams

    constructor(parameters: FindUsersParams) {
        super();
        this.parameters = parameters
    }
}