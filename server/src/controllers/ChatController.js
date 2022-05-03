const {errorHandler} = require("../utils/ErrorHandlerFunction");
const ChatService = require('../services/ChatService')


class ChatController {
    async getUserChats(req, res, next) {
        try {
            const {userId} = req._user
            const result = await ChatService.getUserChats(userId)
            res.json(result)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async createChat(req, res, next) {
        try {
            const {initiatorUserId, interlocutorId} = req.body
            const result = await ChatService.createChat(initiatorUserId, interlocutorId)
            res.json(result)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async sendMessage(req, res, next) {
        try {
            const files = req.files.files
            const body = JSON.parse(req.body.body)
            console.log(files, body)
            res.json('ok')
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async getChatMessages(req, res, next) {
        try {

        } catch (e) {
            next(errorHandler(e))
        }
    }
}

module.exports = new ChatController()