import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";

export interface SendMessageParams extends Params {
    chatId: string,
    userId: string,
    dispatchDate: string,
    message?: string,
}

export default class SendMessageRequest extends BaseRequest<any> {
    method: MethodType = 'post'
    route: string = '/chats/send_message'
    parameters: SendMessageParams
    attachment: Blob[]

    constructor(params: SendMessageParams, attachments: Blob[]) {
        super();
        this.parameters = params
        this.attachment = attachments
    }
}