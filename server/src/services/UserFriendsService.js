const {FriendsModel} = require("../models");
const {Op} = require("sequelize");
const sequelize = require('../database')
const {v4} = require("uuid");


class UserFriendsService {
    async getAllFriends(userId) {
        return await sequelize.transaction(async t => {
            const SQL_query = `
                select fl.user_id_first, fl.user_id_second, fl.accepted, fl.id, us.username, us."imageId"
                from friends_links fl
                    join user_settings us on ((fl.user_id_first <> :id and fl.user_id_second = :id and fl.user_id_first = us.user_id) or (fl.user_id_second <> :id and fl.user_id_first = :id and fl.user_id_second = us.user_id))
            `;
            const [friends] = await sequelize.query(SQL_query, {
                replacements: {
                    id: userId
                }
            })
            return friends.map(obj => {
                let status = 'friend'
                if (!obj.accepted) {
                    status = obj.user_id_first === userId ? 'pending' : 'request'
                }
                return {
                    linkId: obj.id,
                    user: {
                        userId: obj.user_id_first === userId ? obj.user_id_second : obj.user_id_first,
                        userImageId: obj.imageId,
                        username: obj.username
                    },
                    status,
                }

            })
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
            throw new Error('User is already in friend list')
        }
        const friendRequest = await FriendsModel.create({
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
                askedUserId: answeredUserId
            }
        })
        await friendRequest.destroy()
    }
}

module.exports = new UserFriendsService()