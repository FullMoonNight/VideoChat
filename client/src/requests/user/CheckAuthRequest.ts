import BaseRequest from "../BaseRequest";

interface CheckAuthResponse {
    userId?: undefined
}

export default class CheckAuthRequest extends BaseRequest<CheckAuthResponse> {
    route: string = '/user/checkauth'
}