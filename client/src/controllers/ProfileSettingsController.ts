import GetProfileSettingsRequest from "../requests/profile/GetProfileSettingsRequest";
import SaveProfileSettingsRequest, {SaveProfileSettingsParams} from "../requests/profile/SaveProfileSettingsRequest";
import {profileStore} from "../stores/profileStore";
import {systemMessagesStore} from "../stores/systemMessagesStore";

export default class ProfileSettingsController {
    static async getProfileSettings() {
        const command = new GetProfileSettingsRequest()
        const result = await command.execute()

        if (result.status === 200) {
            profileStore.setProfileSettings(result.data)
            profileStore.changeLoaded(true)
        }
    }

    static async saveProfileSettings(parameters: SaveProfileSettingsParams, image: Blob) {
        const command = new SaveProfileSettingsRequest(parameters, image)
        const result = await command.execute()

        if (result.status === 200) {
            profileStore.setProfileSettings(result.data)
            systemMessagesStore.addMessage({message: 'Профиль успешно сохранен', type: 'success'})
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