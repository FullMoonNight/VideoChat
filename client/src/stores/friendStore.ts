//friends - находится в друзьях
//pending - запрос отправлен, но не принят
//request - взодящий запрос дружбы

import {action, makeAutoObservable} from "mobx";
import {FriendElementType} from "../types/FriendElementType";


class FriendStore {
    friends: FriendElementType<'friends'>[]
    request: FriendElementType<'request'>[]
    pending: FriendElementType<'pending'>[]

    constructor() {
        this.friends = []
        this.request = []
        this.pending = []

        makeAutoObservable(this)
    }

    @action
    setFriends(friends: FriendElementType[]) {
        const friendsMap = new Set()
        const pendingMap = new Set()
        const requestMap = new Set()

        this.friends = []
        this.pending = []
        this.request = []

        friends.forEach(element => {
            switch (element.status) {
                case 'friends':
                    if (!friendsMap.has(element.linkId)) {
                        this.friends = [...this.friends, element as FriendElementType<'friends'>]
                        friendsMap.add(element.linkId)
                    }
                    break
                case 'pending':
                    if (!pendingMap.has(element.linkId)) {
                        this.pending = [...this.pending, element as FriendElementType<'pending'>]
                        pendingMap.add(element.linkId)
                    }
                    break
                case 'request':
                    if (!requestMap.has(element.linkId)) {
                        this.request = [...this.request, element as FriendElementType<'request'>]
                        requestMap.add(element.linkId)
                    }
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