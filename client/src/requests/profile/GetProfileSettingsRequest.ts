import BaseRequest from "../BaseRequest";

interface GetSettingsResponse {
    userImageId: string
    username: string
    name?: string
    surname?: string
}

export default class GetProfileSettingsRequest extends BaseRequest<GetSettingsResponse> {
    route: string = '/profile_settings'
}