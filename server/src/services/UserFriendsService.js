const {FriendsModel} = require("../models");
const {Op} = require("sequelize");
const sequelize = require('../database')
const {v4} = require("uuid");
const UserService = require('../services/UserService')


class UserFriendsService {
    async getAllFriends(userId) {
        const SQL_query = `
                select fl.user_id_first, fl.user_id_second, fl.accepted, fl.id, us.username, us."imageId", us.status
                from friends_links fl
                    join user_settings us on ((fl.user_id_first <> :id and fl.user_id_second = :id and fl.user_id_first = us.user_id) or (fl.user_id_second <> :id and fl.user_id_first = :id and fl.user_id_second = us.user_id))
            `;
        const [friends] = await sequelize.query(SQL_query, {
            replacements: {
                id: userId
            }
        })
        return friends.map(obj => {
            let status = 'friends'
            if (!obj.accepted) {
                status = obj.user_id_first === userId ? 'pending' : 'request'
            }
            return {
                linkId: obj.id,
                user: {
                    userId: obj.user_id_first === userId ? obj.user_id_second : obj.user_id_first,
                    userImageId: obj.imageId,
                    username: obj.username,
                    status: obj.status
                },
                status,
            }

        })
    }

    async findFriends(userId, usernamePart) {
        return sequelize.transaction(async t => {
            let friends = await this.getAllFriends(userId)
            const [allUsers] = await UserService.getUsers(usernamePart)

            const friendsMap = new Set()
            friendsMap.add(userId)
            if (friends && !(friends instanceof Array)) {
                friends = [friends]
            }
            friends && friends.forEach(e => friendsMap.add(e.user.userId))
            return allUsers ? allUsers
                    .filter(user => !friendsMap.has(user.user_id))
                    .map(user => ({
                        linkId: user.id,
                        user: {
                            userId: user.user_id,
                            userImageId: user.imageId,
                            username: user.username,
                            status: user.status
                        },
                        status: ''
                    }))
                : []
        })
    }

    async sendFriendRequest(userIdFrom, userIdTo) {
        const presentFriendLinks = await FriendsModel.findOne({
            where: {
                [Op.or]: [
                    {
                        user_id_first: userIdFrom,
                        user_id_second: userIdTo
                    },
                    {
                        user_id_first: userIdTo,
                        user_id_second: userIdFrom
                    }
                ]
            }
        })
        if (presentFriendLinks) {
            throw new Error('User is already in friends list')
        }
        await FriendsModel.create({
            id: v4(),
            user_id_first: userIdFrom,
            user_id_second: userIdTo,
            accepted: false
        })
    }

    async acceptFriendRequest(requestedUserId, respondedUserId) {
        const friendRequest = await FriendsModel.findOne({
            where: {
                user_id_first: requestedUserId,
                user_id_second: respondedUserId
            }
        })
        friendRequest.accepted = true
        await friendRequest.save()
    }

    async rejectFriendRequest(requestedUserId, answeredUserId) {
        const friendRequest = await FriendsModel.findOne({
            where: {
                user_id_first: requestedUserId,
                user_id_second: answeredUserId
            }
        })
        await friendRequest.destroy()
    }

    async removeFriendRequest(firstUserId, secondUserId) {
        const friend = await FriendsModel.findOne({
            where: {
                [Op.or]: [
                    {
                        user_id_first: firstUserId,
                        user_id_second: secondUserId
                    },
                    {
                        user_id_first: secondUserId,
                        user_id_second: firstUserId
                    }]
            }
        })

        console.log(friend)
        await friend.destroy()
    }
}

module.exports = new UserFriendsService()