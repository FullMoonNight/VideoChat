import {action, makeAutoObservable, toJS} from "mobx";

interface MessageType {
    message: string,
    type: KindOfMessage,
    id: number,
}

type KindOfMessage = 'success' | 'error' | 'primary'

class SystemMessagesStore {
    messages: MessageType[]

    constructor() {
        this.messages = []
        makeAutoObservable(this)
    }

    @action
    addMessage(message: { message: string, type: KindOfMessage }) {
        if (!message.message) return
        const id = new Date().getTime()
        this.messages.push({id, ...message})
        setTimeout(() => this.deleteMessage(id), 0)
    }

    @action
    deleteMessage(id: number) {
        this.messages = this.messages.filter(e => e.id !== id)
    }
}

const systemMessagesStore = new SystemMessagesStore()
export {systemMessagesStore}