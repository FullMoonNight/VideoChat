import BaseRequest from "../BaseRequest";

interface GetFriendsResponse {
    linkId: string,
    user: {
        userId: string,
        userImageId: string,
        username: string,
        status: 'active' | 'sleep' | 'invisible'
    }
    status: "friends" | "pending" | "request"
}


export class GetFriendsRequest extends BaseRequest<GetFriendsResponse[]> {
    route: string = '/friends'
}