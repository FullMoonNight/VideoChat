import LoginRequest, {LoginParams} from "../requests/authenticate/LoginRequest";
import RegistrationRequest, {RegisterParams} from "../requests/authenticate/RegistrationRequest";
import MessageController from "./MessageController";
import LogoutRequest from "../requests/authenticate/LogoutRequest";
import CheckAuthRequest from "../requests/authenticate/CheckAuthRequest";
import {appStore} from "../stores/appStore";
import {userStore} from "../stores/userStore";
import {profileStore} from "../stores/profileStore";

export default class AuthController {
    static async login(params: LoginParams) {
        appStore.appStartLoading()
        const command = new LoginRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.accessToken)
            userStore.login({userId: result.data.userId})
            MessageController.success('Успешный вход')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.message)
        }
        appStore.appEndLoading()
    }

    static async registration(params: RegisterParams) {
        appStore.appStartLoading()
        const command = new RegistrationRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.accessToken)
            userStore.login({userId: result.data.userId})
            MessageController.success('Успешная регистрация')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.message)
        }
        appStore.appEndLoading()
    }

    static async logout(automatic?: boolean) {
        appStore.appStartLoading()
        const command = new LogoutRequest()
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.removeItem('accessToken')
            userStore.logout()
            profileStore.changeLoaded(false)
            if (!automatic) MessageController.primary('Произведен выход из системы')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.message)
        }
        appStore.appEndLoading()
    }

    static async checkAuth() {
        const command = new CheckAuthRequest()
        const result = await command.execute()

        if (result.status === 200) {
            userStore.login({userId: result.data.userId})
        }
    }
}