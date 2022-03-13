import {action, makeAutoObservable} from "mobx";

interface UserType {
    userId: string | null
}

class UserStore {
    isAuth: boolean
    user: UserType

    constructor() {
        this.isAuth = false
        this.user = {
            userId: null,
        }
        makeAutoObservable(this)
    }

    @action
    login({userId}: { userId?: string }) {
        this.isAuth = true
        userId && (this.user.userId = userId)
    }

    @action
    logout() {
        this.isAuth = false
        this.user.userId = null
    }
}

const userStore = new UserStore()
export {userStore}