import {Manager, Socket} from "socket.io-client";
import {messageListeners} from "./listeners/messageListeners";
import {roomListeners} from "./listeners/roomListeners";
import {connectionListeners} from "./listeners/connectionListeners";

class SocketInterface {
    private socket: Socket | null = null
    private manager

    constructor() {
        this.manager = new Manager('http://localhost:5000', {
            autoConnect: false,
            reconnectionAttempts: 1000,
            timeout: 2000,
            transports: ['websocket'],
            withCredentials: true,
        })
    }

    setListeners() {
        if (!this.socket) return console.warn('Socket is not connected')
        messageListeners(this.socket)
        roomListeners(this.socket)
        connectionListeners(this.socket)
    }

    createSocket(token: string) {
        this.socket = this.manager.socket('/', {auth: {token}})
        this.setListeners()
    }

    connect() {
        if (!this.socket) return console.warn('Socket is not defined')
        this.socket.connect()
    }

    disconnect() {
        if (!this.socket) return
        this.socket.disconnect()
    }

    on(event: string, handler: (data: any) => void) {
        if (!this.socket) return console.warn('Socket is not defined')
        this.socket.on(event, handler)
    }

    off(event: string) {
        if (!this.socket) return console.warn('Socket is not defined')
        this.socket.off(event)
    }

    emit(event: string, data: any) {
        if (!this.socket) return console.warn('Socket is not defined')
        this.socket.emit(event, data)
    }

    checkConnection() {
        if (!this.socket) return console.warn('Socket is not defined')
        console.log(this.socket.connected)
    }
}

const socketInterface = new SocketInterface()
export {socketInterface}