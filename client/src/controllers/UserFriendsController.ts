import {GetFriendsCommand} from "../requests/friend/GetFriendsCommand";
import {friendStore} from "../stores/fiendStore";


export default class UserFriendsController {
    static async getAllFriends() {
        const command = new GetFriendsCommand()
        const result = await command.execute()

        if (result.status === 200) {
            friendStore.setFriends(result.data)
            return result.data
        }
        return []
    }
}