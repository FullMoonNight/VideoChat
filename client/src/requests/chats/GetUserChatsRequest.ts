import BaseRequest from "../BaseRequest";
import {ChatElementType} from "../../types/ChatElementType";

export default class GetUserChatsRequest extends BaseRequest<ChatElementType[]> {
    route: string = '/chats'
}