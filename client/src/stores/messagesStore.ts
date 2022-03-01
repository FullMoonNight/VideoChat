import {action, makeAutoObservable} from "mobx";

interface MessageType {
    message: string,
    type: KindOfMessage,
    // cssClass: 'visible' | 'vanishing',
    id: number,
}

type KindOfMessage = 'success' | 'error' | 'primary'

export default class MessagesStore {
    messages: MessageType[]

    constructor() {
        this.messages = []
        makeAutoObservable(this)
    }

    @action
    async addMessage(message: { message: string, type: KindOfMessage }) {
        const id = new Date().getTime()
        this.messages.push({id: id, message: message.message, type: message.type})
        await new Promise(resolve => setTimeout(resolve, 2000))
        this.deleteMessage(id)
    }

    @action
    deleteMessage(id: number) {
        this.messages.filter(e => e.id !== id)
    }
}