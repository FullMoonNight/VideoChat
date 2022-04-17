import {action, makeAutoObservable} from "mobx";
import {ProfileSettingsType} from "../types/ProfileSettingsType";

class ProfileStore {
    settings: ProfileSettingsType
    loaded: boolean

    constructor() {
        this.settings = {
            userImageId: '',
            username: ''
        }
        this.loaded = false
        makeAutoObservable(this, undefined, {deep: true})
    }

    @action
    setProfileSettings(params: ProfileSettingsType) {
        this.settings = params
    }

    @action
    changeLoaded(value: boolean) {
        this.loaded = value
    }
}

const profileStore = new ProfileStore()
export {profileStore}