import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";
import {log} from "util";

export interface SaveProfileSettingsParams extends Params {
    username: string,
    name?: string
    surname?: string | null
}

interface SaveSettingsResponse {
    userImageId: string
    username: string
    name?: string
    surname?: string
}

export default class SaveProfileSettingsRequest extends BaseRequest<SaveSettingsResponse> {
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