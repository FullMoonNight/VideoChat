import {action, makeAutoObservable} from "mobx";

export default class AuthStore {
    isAuth: boolean

    constructor() {
        this.isAuth = false
        makeAutoObservable(this)
    }

    @action
    login() {
        this.isAuth = true
    }

    @action
    logout() {
        this.isAuth = false
    }
}