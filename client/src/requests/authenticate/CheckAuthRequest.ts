import BaseRequest from "../BaseRequest";

interface CommandResponse {
    userId?: undefined
}

export default class CheckAuthRequest extends BaseRequest<CommandResponse> {
    route: string = '/authenticate/checkauth'
}