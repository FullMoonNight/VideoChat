import {MethodType, Params} from "../../http/RequestInterface";
import BaseRequest from "../BaseRequest";

export interface LoginParams extends Params {
    email: string,
    password: string,
}

interface LoginResponse {
    accessToken: string,
    userId: string
}

export default class LoginRequest extends BaseRequest<LoginResponse> {
    method: MethodType = 'post'
    route: string = '/authenticate/login'
    parameters: LoginParams
    
    constructor(parameters: LoginParams) {
        super()
        this.parameters = parameters
    }
}