import {MethodType, Params} from "../../http/RequestInterface";
import BaseRequest from "../BaseRequest";

export interface RegisterParams extends Params {
    username: string,
    email: string,
    password: string,
}

interface RegistrationResponse {
    accessToken: string,
    userId: string
}

export default class RegistrationRequest extends BaseRequest<RegistrationResponse> {
    method: MethodType = "post"
    route: string = "/authenticate/registration"
    parameters: RegisterParams

    constructor(parameters: RegisterParams) {
        super()
        this.parameters = parameters
    }
}