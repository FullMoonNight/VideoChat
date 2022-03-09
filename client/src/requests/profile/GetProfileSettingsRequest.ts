import BaseRequest from "../BaseRequest";

interface ProfileSettingsResponse {
    userImageId: string
    username: string
    name: string | undefined
    surname: string | undefined
}

export default class GetProfileSettingsRequest extends BaseRequest<ProfileSettingsResponse> {
    route: string = '/profile_settings'
}