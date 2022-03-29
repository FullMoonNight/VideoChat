//friends - находится в друзьях
//pending - запрос отправлен, но не принят
//request - взодящий запрос дружбы

import {action, makeAutoObservable, toJS,} from "mobx";

interface FriendType<T extends "friends" | "pending" | "request"> {
    linkId: string,
    user: {
        userId: string,
        userImageId: string,
        username: string,
        status: 'active' | 'sleep' | 'invisible'
    }
    status: T
}

class FriendStore {
    friends: FriendType<'friends'>[]
    request: FriendType<'request'>[]
    pending: FriendType<'pending'>[]

    constructor() {
        this.friends = []
        this.request = []
        this.pending = []

        makeAutoObservable(this)
    }

    @action
    setFriends(friends: FriendType<'friends' | "pending" | "request">[]) {
        const friendsMap = new Set(this.friends.map(e => e.linkId))
        const requestMap = new Set(this.request.map(e => e.linkId))
        const pendingMap = new Set(this.pending.map(e => e.linkId))

        this.friends = []
        this.pending = []
        this.request = []

        friends.forEach(element => {
            switch (element.status) {
                case 'friends':
                    if (!friendsMap.has(element.linkId)) this.friends = [...this.friends, element as FriendType<'friends'>]
                    break
                case 'pending':
                    if (!pendingMap.has(element.linkId)) this.pending = [...this.pending, element as FriendType<'pending'>]
                    break
                case 'request':
                    if (!requestMap.has(element.linkId)) this.request = [...this.request, element as FriendType<'request'>]
                    break
            }
        })
        // console.log('updated', toJS(this))
    }

    getAllFriends() {
        return [...this.friends, ...this.pending, ...this.request]
    }
}

const friendStore = new FriendStore()
export {friendStore}