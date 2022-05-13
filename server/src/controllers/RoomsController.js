const RoomsService = require('../services/RoomsService');

const {errorHandler} = require("../utils/ErrorHandlerFunction");


class RoomsController {
    async getUserRooms(req, res, next) {
        try {
            const {userId} = req._user
            const result = await RoomsService.getUserRooms(userId)
            res.json(result)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async getRoomInfo(req, res, next) {
        try {
            const {userId} = req._user
            const {roomId} = req.query

            const result = await RoomsService.getRoomInfo(userId, roomId)
            res.json(result)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async createNewRoom(req, res, next) {
        try {
            const {userId, room: {roomName, includedUsersId, handWrEditor, textEditor, chat: chatEnabled}} = req.body
            const response = await RoomsService.createNewRoom(userId, roomName, includedUsersId, handWrEditor, textEditor, chatEnabled)
            res.json(response)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async confirmJoinRoom(req, res, next) {
        try {
            const {userId} = req._user
            const {roomId} = req.body
            await RoomsService.confirmJoin(userId, roomId)
            res.json('ok')
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async leaveRoom(req, res, next) {
        try {
            const {userId} = req._user
            const {roomId} = req.body

            await RoomsService.removeUserFromRoom(userId, roomId)
            res.json('ok')
        } catch (e) {
            next(errorHandler(e))
        }
    }
}

module.exports = new RoomsController()