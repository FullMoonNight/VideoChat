import {GetFriendsRequest} from "../requests/friends/GetFriendsRequest";
import {friendStore} from "../stores/friendStore";
import {FindFriendsByUsernameRequest, FindUsersParams} from "../requests/friends/FindFriendsByUsernameRequest";
import {SendFriendParams, SendFriendRequest} from "../requests/friends/SendFriendRequest";
import {RejectFriendParams, RejectFriendRequest} from "../requests/friends/RejectFriendRequest";
import {AcceptFriendParams, AcceptFriendRequest} from "../requests/friends/AcceptFriendRequest";
import {RemoveFriendParams, RemoveFriendRequest} from "../requests/friends/RemoveFriendRequest";


export default class UserFriendsController {
    static async getAllFriends() {
        const command = new GetFriendsRequest()
        const result = await command.execute()

        if (result.status === 200) {
            friendStore.setFriends(result.data)
        }
    }

    static async findFriendsByUsername(params: FindUsersParams) {
        const command = new FindFriendsByUsernameRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            return result.data
        } else {
            return []
        }
    }

    static async sendFriendRequest(params: SendFriendParams) {
        const command = new SendFriendRequest(params)
        await command.execute()

        await this.getAllFriends()
    }

    static async acceptFriendRequest(params: AcceptFriendParams) {
        const command = new AcceptFriendRequest(params)
        await command.execute()

        await this.getAllFriends()
    }

    static async rejectFriendRequest(params: RejectFriendParams) {
        const command = new RejectFriendRequest(params)
        await command.execute()

        await this.getAllFriends()
    }

    static async removeFriendRequest(params: RemoveFriendParams) {
        const command = new RemoveFriendRequest(params)
        await command.execute()

        await this.getAllFriends()
    }
}