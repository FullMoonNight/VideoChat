import {messagesStore} from "../stores/messagesStore";

export default class MessageController {
    static success(message: string) {
        messagesStore.addMessage({message, type: "success"})
    }

    static error(message: string) {
        messagesStore.addMessage({message, type: "error"})
    }

    static primary(message: string) {
        messagesStore.addMessage({message, type: "primary"})
    }
}