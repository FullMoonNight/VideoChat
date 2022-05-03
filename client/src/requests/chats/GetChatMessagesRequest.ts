import BaseRequest from "../BaseRequest";
import {Params} from "../../http/RequestInterface";
import {TextMessageElementType} from "../../types/TextMessageElementType";
import {FileMessageElementType} from "../../types/FileMessageElementType";

export interface GetChatMessagesParams extends Params {
    count?: number,
    chatId: string
}

interface GetChatMessagesResponse {
    chatId: string,
    messages: (TextMessageElementType | FileMessageElementType)[]
}

export default class GetChatMessagesRequest extends BaseRequest<GetChatMessagesResponse> {
    route: string = '/chats/chat_messages'
    parameters: GetChatMessagesParams

    constructor(params: GetChatMessagesParams) {
        super();
        this.parameters = params
    }
}