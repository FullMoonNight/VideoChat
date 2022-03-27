//friend - находится в друзьях
//pending - запрос отправлен, но не принят
//request - взодящий запрос дружбы

import {action, makeAutoObservable} from "mobx";

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
        makeAutoObservable(this, undefined, {deep: true})
    }

    @action
    setFriends(friends: FriendType<'friend' | "pending" | "request">[]) {
        const friendsMap = new Set(this.friends.friends.map(e => e.linkId))
        const requestMap = new Set(this.friends.request.map(e => e.linkId))
        const pendingMap = new Set(this.friends.pending.map(e => e.linkId))

        friends.forEach(element => {
            switch (element.status) {
                case 'friend':
                    if (!friendsMap.has(element.linkId)) this.friends.friends.push(element as FriendType<'friend'>)
                    break
                case 'pending':
                    if (!pendingMap.has(element.linkId)) this.friends.pending.push(element as FriendType<'pending'>)
                    break
                case 'request':
                    if (!requestMap.has(element.linkId)) this.friends.request.push(element as FriendType<'request'>)
                    break
            }
        })
    }
}

const friendStore = new FriendStore()
export {friendStore}