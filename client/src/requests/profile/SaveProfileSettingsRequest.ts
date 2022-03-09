import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";
import {log} from "util";

export interface SaveProfileSettingsParams extends Params {
    username: string,
    name?: string
    surname?: string | null
}

export default class SaveProfileSettingsRequest extends BaseRequest<any> {
    method: MethodType = 'post'
    route: string = '/profile_settings'
    queryParams: boolean = true
    parameters: SaveProfileSettingsParams
    haveBinaryData: boolean = true
    binaryData: ArrayBuffer

    constructor(parameters: SaveProfileSettingsParams, requestBody: ArrayBuffer) {
        super();
        this.parameters = parameters
        this.binaryData = requestBody
        console.log(requestBody)
    }
}