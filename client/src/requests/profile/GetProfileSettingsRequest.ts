import BaseRequest from "../BaseRequest";

interface CommandResponse {
    userImageId: string
    username: string
    name?: string
    surname?: string
}

export default class GetProfileSettingsRequest extends BaseRequest<CommandResponse> {
    route: string = '/profile_settings'
}