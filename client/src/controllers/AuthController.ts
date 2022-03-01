import LoginRequest, {LoginParams} from "../requests/user/LoginRequest";
import RegistrationRequest, {RegisterParams} from "../requests/user/RegistrationRequest";
// import MessageController from "./MessageController";
import LogoutRequest from "../requests/user/LogoutRequest";
import CheckAuthRequest from "../requests/user/CheckAuthRequest";
import AppStore from "../stores/appStore";
import AuthStore from "../stores/authStore";

const appStore = new AppStore()
const authStore = new AuthStore()

export default class AuthController {
    static async login(params: LoginParams) {
        appStore.appStartLoading()
        const command = new LoginRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.accessToken)
            authStore.login()
            // MessageController.success('Успешный вход')
        } else if (result.response && result.response.status !== 500) {
            // MessageController.error(result.response.data.error)
        }
        appStore.appEndLoading()
    }

    static async registration(params: RegisterParams) {
        appStore.appStartLoading()
        const command = new RegistrationRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.accessToken)
            authStore.login()
            // MessageController.success('Успешная регистрация')
        } else if (result.response && result.response.status !== 500) {
            // MessageController.error(result.response.data.error)
        }
        appStore.appEndLoading()
    }

    static async logout(automatic?: boolean) {
        appStore.appStartLoading()
        const command = new LogoutRequest()
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.removeItem('accessToken')
            authStore.logout()
            // if (!automatic) MessageController.primary('Произведен выход из системы')
        } else if (result.response && result.response.status !== 500) {
            // MessageController.error(result.response.data.error)
        }
        appStore.appEndLoading()
    }

    static async checkAuth() {
        const command = new CheckAuthRequest()
        const result = await command.execute()

        if (result.status === 200) {
            authStore.login()
        }
    }
}