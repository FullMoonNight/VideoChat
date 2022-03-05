import {action, makeAutoObservable} from "mobx";

interface UserType {
    id: string | null
}

class AuthStore {
    isAuth: boolean
    user: UserType

    constructor() {
        this.isAuth = false
        this.user = {
            id: null
        }
        makeAutoObservable(this)
    }

    @action
    login({userId}: { userId?: string }) {
        this.isAuth = true
        userId && (this.user.id = userId)
    }

    @action
    logout() {
        this.isAuth = false
        this.user.id = null
    }
}

const authStore = new AuthStore()
export {authStore}