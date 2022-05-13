import {Socket} from "socket.io-client";
import ChatsController from "../../controllers/ChatsController";

export function messageListeners(socket: Socket) {
    socket.on('UPDATE_CHAT_MESSAGES', ({chatId, chatType, messageCount}: { chatId: string, chatType: 'common' | 'room', messageCount: number }) => {
        ChatsController.getChatMessages({chatId, type: chatType, count: messageCount})
    })
}