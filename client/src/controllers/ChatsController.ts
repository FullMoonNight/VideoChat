import GetUserChatsRequest from "../requests/chats/GetUserChatsRequest";
import SendMessageRequest, {SendMessageParams} from "../requests/chats/SendMessageRequest";
import CreateChatRequest, {CreateChatParams} from "../requests/chats/CreateChatRequest";
import GetChatMessagesRequest, {GetChatMessagesParams} from "../requests/chats/GetChatMessagesRequest";
import {chatStore} from "../stores/chatStore";
import DownloadFileRequest, {DownloadFileParams} from "../requests/chats/DownloadFileRequest";

export default class ChatsController {
    static async getUserChats() {
        const command = new GetUserChatsRequest()
        const result = await command.execute()

        if (result.status === 200) {
            chatStore.setChats(result.data)
        }
    }

    static async sendMessage(params: SendMessageParams, attach: Blob[]) {
        const command = new SendMessageRequest(params, attach)
        const result = await command.execute()

        if (result.status === 200) {
            chatStore.addMessages(params.chatId, result.data)
        }
    }

    static async createChat(params: CreateChatParams) {
        const command = new CreateChatRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            chatStore.addChat(result.data)
            return result.data
        }
    }

    static async getChatMessages(params: GetChatMessagesParams) {
        const command = new GetChatMessagesRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            chatStore.addMessages(result.data.chatId, result.data.messages)
        }
    }

    static async downloadFile(params: DownloadFileParams) {
        const command = new DownloadFileRequest(params)
        const result = await command.execute()

        if (result.status === 200) {
            let name = decodeURI(result.headers['content-disposition'].replace("attachment; filename=", ''))
            const url = URL.createObjectURL(new Blob([result.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.remove()
        }
    }
}