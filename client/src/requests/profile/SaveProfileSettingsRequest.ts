import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";
import {ProfileSettingsType} from "../../types/ProfileSettingsType";

export interface SaveProfileSettingsParams extends Params {
    username: string,
    name?: string
    surname?: string | null
}

export default class SaveProfileSettingsRequest extends BaseRequest<ProfileSettingsType> {
    method: MethodType = 'post'
    route: string = '/profile_settings'
    parameters: SaveProfileSettingsParams
    attachment: Blob

    constructor(parameters: SaveProfileSettingsParams, attachment: Blob) {
        super();
        this.parameters = parameters
        this.attachment = attachment
    }
}