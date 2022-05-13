const JwtService = require('../services/JwtService')
const {messageListeners} = require("./listeners/messageListeners");
const {callListeners} = require("./listeners/callListeners");
const {p2pConnectionListeners} = require("./listeners/p2pConnectionListeners");


class SocketInterface {
    static #singletonInstance = null

    #ioMain
    #usersMap = {}

    constructor(io) {
        if (SocketInterface.#singletonInstance) return SocketInterface.#singletonInstance

        io.use((socket, next) => {
            socket._userId = JwtService.validateAccessToken(socket.handshake.auth.token).userId
            next()
        })

        this.#ioMain = io
        this.#initListeners()
        SocketInterface.#singletonInstance = this
    }

    get ioMain() {
        return this.#ioMain;
    }

    get usersMap() {
        return this.#usersMap;
    }

    #initListeners() {
        this.#ioMain.on('connection', socket => {
            console.log('connect ####', socket.id)
            this.#mapUserSessions(socket._userId, socket.id)

            socket.on('disconnect', reason => {
                console.log('disconnect ####', socket.id, reason)
                this.#removeDisconnectedSocket(socket._userId, socket.id)
            })

            messageListeners(socket, this)
            p2pConnectionListeners(socket, this)
            callListeners(socket, this)

        })
    }

    #mapUserSessions(userId, socketId) {
        if (this.#usersMap[userId]) {
            this.#usersMap[userId].push(socketId)
        } else {
            this.#usersMap[userId] = [socketId]
        }
    }

    #removeDisconnectedSocket(userId, socketId) {
        this.#usersMap[userId] = this.#usersMap[userId].filter(e => e !== socketId)
        if (!this.#usersMap[userId].length) delete this.#usersMap[userId]
    }

    emitTo(userId, event, message) {
        const userSockets = this.#usersMap[userId]
        if (userSockets instanceof Array && userSockets.length) {
            userSockets.forEach(socketId => {
                this.#ioMain.to(socketId).emit(event, message)
            })
        }
    }
}

module.exports = SocketInterface