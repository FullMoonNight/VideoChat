import BaseRequest from "../BaseRequest";

interface GetFriendsResponse {
    linkId: string,
    user: {
        userId: string,
        userImageId: string,
        username: string,
        status?: 'active' | 'sleep' | 'invisible'
    }
    status: "friend" | "pending" | "request"
}


export class GetFriendsCommand extends BaseRequest<GetFriendsResponse[]> {
    route: string = '/friends'
}