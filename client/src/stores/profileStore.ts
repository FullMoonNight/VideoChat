import {makeAutoObservable} from "mobx";

class ProfileStore {
    username: string
    name: string | null
    surname: string | null

    constructor() {
        this.username = ''
        this.name = null
        this.surname = null
        makeAutoObservable(this)
    }
}

const profileStore = new ProfileStore()
export {profileStore}