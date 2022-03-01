import BaseRequest from "../BaseRequest";

export default class CheckAuthRequest extends BaseRequest<null> {
    route: string = '/user/checkauth'
}