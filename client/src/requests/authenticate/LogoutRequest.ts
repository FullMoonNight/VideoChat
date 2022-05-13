import BaseRequest from "../BaseRequest";
import {MethodType} from "../../http/RequestInterface";

export default class LogoutRequest extends BaseRequest<null> {
    method: MethodType = "post"
    route: string = '/authenticate/logout'
}