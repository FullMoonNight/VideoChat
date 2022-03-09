import GetProfileSettingsRequest from "../requests/profile/GetProfileSettingsRequest";
import {userStore} from "../stores/userStore";
import SaveProfileSettingsRequest, {SaveProfileSettingsParams} from "../requests/profile/SaveProfileSettingsRequest";

export default class ProfileSettingsController {
    static async getProfileSettings() {
        const command = new GetProfileSettingsRequest()
        const result = await command.execute()

        if (result.status === 200) {
            userStore.user.userImageId = result.data.userImageId

        }
    }

    static async saveProfileSettings(parameters: SaveProfileSettingsParams, requestBody: ArrayBuffer) {
        const command = new SaveProfileSettingsRequest(parameters, requestBody)
        const result = await command.execute()

        if (result.status === 200) {
            console.log(result.data)
        }
    }

    static changeColorScheme(currentScheme: 'light' | 'dark') {
        localStorage.setItem('colorScheme', currentScheme)

        const pastScheme: 'light' | 'dark' = currentScheme === 'light' ? 'dark' : 'light'
        document.body.classList.remove(pastScheme)
        document.body.classList.add(currentScheme)

    }

    static getCurrentColorScheme(): 'light' | 'dark' {
        let scheme = localStorage.getItem('colorScheme')
        if (!scheme) {
            scheme = 'light'
            localStorage.setItem('colorScheme', 'light')
        }
        return scheme as 'light' | 'dark'
    }
}