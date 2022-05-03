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
            let files = req.files?.files
            const data = JSON.parse(req.body.body)
            const messages = await ChatService.sendMessage(data, files)
            res.json(messages)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async getChatMessages(req, res, next) {
        try {
            const {count, chatId, type} = req.query
            const messages = await ChatService.getMessages(chatId, type, count)
            res.json({chatId, messages})
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async downloadFile(req, res, next) {
        try {
            const {chatId, chatType, messageId} = req.query
            const file = await ChatService.getStream(chatId, messageId, chatType)
            res.setHeader('Content-Type', 'application/liquid')
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
            res.setHeader('Content-Disposition', `attachment; filename=${encodeURI(file.fileName)}`)

            res.send(file.fileBuffer)
        } catch (e) {
            next(errorHandler(e))
        }
    }
}

module.exports = new ChatController()