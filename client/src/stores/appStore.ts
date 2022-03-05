import {makeAutoObservable} from "mobx";

class AppStore {
    waiting: boolean
    loading: boolean

    constructor() {
        this.waiting = false
        this.loading = false
        makeAutoObservable(this)
    }

    appStartWaiting() {
        this.waiting = true
    }

    appEndWaiting() {
        this.waiting = false
    }

    appStartLoading() {
        this.loading = true
    }

    appEndLoading() {
        this.loading = false
    }
}

const appStore = new AppStore()
export {appStore}