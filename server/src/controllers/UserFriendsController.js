const UserFriendsService = require('../services/UserFriendsService')
const {errorHandler} = require("../utils/ErrorHandlerFunction");


class UserFriendsController {
    async getAllFriends(req, res, next) {
        try {
            const userId = req._user.userId
            const friends = await UserFriendsService.getAllFriends(userId)
            console.log(friends)
            res.json(friends)
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async sendFriendRequest(req, res, next) {
        try {
            const userIdFrom = req._user.userId
            const userIdTo = req.body.userId
            await UserFriendsService.sendFriendRequest(userIdFrom, userIdTo)

            res.json('ok')
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async acceptFriendRequest(req, res, next) {
        try {
            const answeredUserId = req._user.userId
            const requestedUserId = req.body.userId
            await UserFriendsService.acceptFriendRequest(requestedUserId, answeredUserId)

            res.json('ok')
        } catch (e) {
            next(errorHandler(e))
        }
    }

    async rejectFriendRequest(req, res, next) {

    }
}

module.exports = new UserFriendsController()