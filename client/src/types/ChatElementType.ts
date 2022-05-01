import {UserElementType} from "./UserElementType";
import {TextMessageElementType} from "./TextMessageElementType";
import {FileMessageElementType} from "./FileMessageElementType";

export interface ChatElementType {
    chatId: string,
    chatMembers: UserElementType[]
    messages: (TextMessageElementType | FileMessageElementType)[]
    type: 'direct' | 'group'
}