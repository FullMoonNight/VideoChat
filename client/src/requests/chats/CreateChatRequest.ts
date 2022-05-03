import BaseRequest from "../BaseRequest";
import {ChatElementType} from "../../types/ChatElementType";
import {MethodType, Params} from "../../http/RequestInterface";

export interface CreateChatParams extends Params {
    initiatorUserId: string,
    interlocutorId: string
}

export default class CreateChatRequest extends BaseRequest<ChatElementType> {
    method: MethodType = 'post'
    route: string = '/chats/create_chat'
    parameters: CreateChatParams

    constructor(params: CreateChatParams) {
        super();
        this.parameters = params
    }
}