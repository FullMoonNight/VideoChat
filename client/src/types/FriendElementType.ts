import {UserElementType} from "./UserElementType";

type friendGroupType = "friends" | "pending" | "request";

export interface FriendElementType<T extends friendGroupType = friendGroupType> {
    linkId: string,
    user: UserElementType
    status: T
}