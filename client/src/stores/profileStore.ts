import {action, makeAutoObservable} from "mobx";

class ProfileStore {
    userImageId: string
    username: string
    name?: string
    surname?: string
    loaded: boolean

    constructor() {
        this.userImageId = ''
        this.username = ''
        this.loaded = false
        makeAutoObservable(this)
    }

    @action
    setProfileSettings(params: { userImageId: string, username: string, name?: string, surname?: string }) {
        Object.entries(params).forEach(([key, value]) => {
            const k = key as keyof ProfileStore
            if (value) {
                (this as Record<typeof k, any>)[k] = value
            }
        })
    }

    @action
    changeLoaded(value: boolean) {
        this.loaded = value
    }
}

const profileStore = new ProfileStore()
export {profileStore}