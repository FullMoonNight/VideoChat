import BaseRequest from "../BaseRequest";
import {MethodType, Params} from "../../http/RequestInterface";
import {TextMessageElementType} from "../../types/TextMessageElementType";
import {FileMessageElementType} from "../../types/FileMessageElementType";

export interface SendMessageParams extends Params {
    chatId: string,
    chatType: 'common' | 'room'
    userId: string,
    dispatchDate: string,
    message?: string,
}

export default class SendMessageRequest extends BaseRequest<(TextMessageElementType | FileMessageElementType)[]> {
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