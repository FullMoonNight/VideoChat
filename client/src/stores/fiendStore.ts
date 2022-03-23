//friend - находится в друзьях
//pending - запрос отправлен, но не принят
//request - взодящий запрос дружбы

interface FriendType<T extends "friend" | "pending" | "request"> {
    linkId: string,
    user: {
        userId: string,
        userImageId: string,
        username: string,
        status?: 'active' | 'sleep' | 'invisible'
    }
    status: T
}

interface AllFriendsType {
    friends: FriendType<'friend'>[],
    request: FriendType<'request'>[],
    pending: FriendType<'pending'>[]
}

class FriendStore {
    friends: AllFriendsType

    constructor() {
        this.friends = {
            friends: [],
            request: [],
            pending: []
        }
    }

    setFriends(friends: FriendType<'friend' | "pending" | "request">[]) {
        friends.forEach(element => {
            switch (element.status) {
                case 'friend':
                    if (!this.friends.friends.find(e => e.linkId === element.linkId)) {
                        this.friends.friends.push(element as FriendType<'friend'>)
                    }
                    break
                case 'pending':
                    if (!this.friends.pending.find(e => e.linkId === element.linkId)) {
                        this.friends.pending.push(element as FriendType<'pending'>)
                    }
                    break
                case 'request':
                    if (!this.friends.request.find(e => e.linkId === element.linkId)) {
                        this.friends.request.push(element as FriendType<'request'>)
                    }
                    break
            }
        })
    }
}

const friendStore = new FriendStore()
export {friendStore}