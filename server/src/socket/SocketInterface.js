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
            this.#mapUserSessions(socket.handshake.auth.token, socket.id)

            socket.on('disconnect', reason => {
                console.log('disconnect ####', socket.id, reason)
                this.#removeDisconnectedSocket(socket.handshake.auth.token, socket.id)
            })

            messageListeners(socket, this)
            p2pConnectionListeners(socket, this)
            callListeners(socket, this)

        })
    }

    #mapUserSessions(token, socketId) {
        const userObj = JwtService.validateAccessToken(token)
        if (!userObj) return
        const userId = userObj.userId
        if (this.#usersMap[userId]) {
            this.#usersMap[userId].push(socketId)
        } else {
            this.#usersMap[userId] = [socketId]
        }
    }

    #removeDisconnectedSocket(token, socketId) {
        const userId = JwtService.validateAccessToken(token).userId
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