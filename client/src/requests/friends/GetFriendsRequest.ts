import BaseRequest from "../BaseRequest";
import {FriendElementType} from "../../types/FriendElementType";

interface GetFriendsResponse extends FriendElementType {
}


export class GetFriendsRequest extends BaseRequest<GetFriendsResponse[]> {
    route: string = '/friends'
}