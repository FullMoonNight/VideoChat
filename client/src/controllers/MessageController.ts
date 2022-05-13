import {systemMessagesStore} from "../stores/systemMessagesStore";

export default class MessageController {
    static success(message: string) {
        systemMessagesStore.addMessage({message, type: "success"})
    }

    static error(message: string) {
        systemMessagesStore.addMessage({message, type: "error"})
    }

    static primary(message: string) {
        systemMessagesStore.addMessage({message, type: "primary"})
    }
}