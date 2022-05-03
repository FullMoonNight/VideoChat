import {ChatElementType} from "../types/ChatElementType";
import {action, makeAutoObservable} from "mobx";

const tempChat: ChatElementType[] = [{
    chatId: '505ab6c8-2798-4df9-9abc-73072411821a',
    chatMembers: [{
        userId: "97344c10-a39f-4287-816f-bc3c7f68a897",
        userImageId: "268e646e-678e-4241-83ac-58e0247c07c0",
        username: "user2",
        status: "active",
    }],
    messages: [
        {
            messageId: '97d11f23-ee27-4711-9325-4deedadac4b9',
            senderUserId: '97344c10-a39f-4287-816f-bc3c7f68a897',
            value: 'Привет!',
            type: 'text',
            sendDate: '2022-04-30T23:12:03.163Z'
        },
        {
            messageId: '92002803-a348-4db8-838e-a11e86917f24',
            senderUserId: '97344c10-a39f-4287-816f-bc3c7f68a897',
            value: 'Как дела?',
            type: 'text',
            sendDate: '2022-04-30T23:12:05.163Z'
        },
        {
            messageId: 'f84c809a-cb87-41f0-898b-c93d33b02895',
            senderUserId: '0080530d-92ea-401c-af64-e66b02c6fb46',
            value: 'Привет, все круто))',
            type: 'text',
            sendDate: '2022-04-30T23:12:07.163Z'
        },
        {
            messageId: '64c0644c-5578-454f-9919-8a1a88a169aa',
            senderUserId: '97344c10-a39f-4287-816f-bc3c7f68a897',
            value: 'Супер asdfads ad fad fdkf adf dk fakdf asdkf k sdfk fdkf adf dk fakdf asdkf k sdfk fdkf adf dk fakdf asdkf k sdfk fdkf adf dk fakdf asdkf k sdfk',
            type: 'text',
            sendDate: '2022-04-30T23:12:10.163Z'
        },
        {
            messageId: '429d3b3d-2a99-48f7-9407-d8e4cdf327b7',
            senderUserId: '97344c10-a39f-4287-816f-bc3c7f68a897',
            type: 'file',
            sendDate: '2022-04-30T23:12:10.163Z',
            fileName: 'file.txt',
            size: 100000000
        },
        {
            messageId: '429d3b3d-2a99-48f7-9407-d8e4cdf3hgb7',
            senderUserId: '0080530d-92ea-401c-af64-e66b02c6fb46',
            type: 'file',
            sendDate: '2022-04-30T23:12:10.163Z',
            fileName: 'file2.txt',
            size: 1300
        }
    ],
    type: 'room'
}]

class ChatStore {
    chats: ChatElementType[]

    constructor() {
        this.chats = tempChat

        makeAutoObservable(this)
    }

    @action
    setChats(chats: ChatElementType[]) {
        this.chats = chats
    }

    @action
    addChat(chat: ChatElementType) {
        const chatInList = this.chats.find(currChat => chat.chatId === currChat.chatId)
        if (chatInList) return
        this.chats = [...this.chats, chat]
    }
}

const chatStore = new ChatStore()
export {chatStore}