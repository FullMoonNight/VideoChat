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

    async createNewRoom(req, res, next) {
        try {
            const {userId, room: {roomName, includedUsersId, handWrEditor, textEditor}} = req.body
            const response = await RoomsService.createNewRoom(userId, roomName, includedUsersId, handWrEditor, textEditor)
            res.json(response)
        } catch (e) {
            next(errorHandler(e))
        }
    }
}

module.exports = new RoomsController()