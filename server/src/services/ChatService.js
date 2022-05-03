const sequelize = require('../database')
const {CommonChatsModel, CommonChatMembersModel, PersonalMessagesModel, ChatMessagesModel} = require("../models");
const {v4} = require("uuid");
const SocketInterface = require('../socket/SocketInterface')


class ChatService {
    async createChat(initiatorUserId, interlocutorId) {
        const chatResult = await sequelize.transaction(async () => {
            const chat = await CommonChatsModel.create({
                id: v4()
            })
            const chatMembers = []
            for (const user_id of [initiatorUserId, interlocutorId]) {
                const userSQL = `
                    select u.user_id, us.status, us."imageId", username
                    from users u 
                        join user_settings us on us.user_id = u.user_id
                    where u.user_id = :userId
                `
                const [[user]] = await sequelize.query(userSQL, {
                    replacements: {
                        userId: user_id
                    }
                })
                if (!user) return console.log(`user ${user_id} is not exist`)
                await CommonChatMembersModel.create({
                    id: v4(),
                    chat_id: chat.id,
                    user_id
                })
                chatMembers.push(user)
            }

            return {
                chatId: chat.id,
                chatMembers: chatMembers.map(userData => ({
                    userId: userData.user_id,
                    userImageId: userData.imageId,
                    username: userData.username,
                    status: userData.status
                })),
                messages: [],
                type: 'common'
            }
        })
        chatResult.chatMembers.forEach(user => new SocketInterface().emitTo(user.userId, 'UPDATE_CHATS'))
        return chatResult
    }

    async getUserChats(userId) {
        return await sequelize.transaction(async () => {
            const userCommonChats = await CommonChatMembersModel.findAll({
                where: {
                    user_id: userId
                }
            })
            const userRoomChatsSQL = `
                select chat_id
                from room_members rm 
                     join room_chats r on r.room_id = rm.room_id
                where rm.user_id = :userId
            `
            const [userRoomChats] = await sequelize.query(userRoomChatsSQL, {
                replacements: {
                    userId
                }
            })

            const userCommonChatsInfo = [], userRoomChatsInfo = [];
            for (let userCommonChat of userCommonChats) {
                userCommonChatsInfo.push(await this.getCommonChatInfo(userCommonChat.chat_id))
            }

            for (const userRoomChat of userRoomChats) {
                userRoomChatsInfo.push(await this.getRoomChatInfo(userRoomChat.chat_id))
            }

            return [...userCommonChatsInfo, ...userRoomChatsInfo]
        })
    }

    async getRoomChatInfo(chatId) {
        return await sequelize.transaction(async () => {
            const membersSQL = `
                select us.user_id, us.username, us."imageId", us.status
                from room_chats rc
                         join rooms r on rc.room_id = r.room_id
                         join room_members rm on r.room_id = rm.room_id
                         join user_settings us on rm.user_id = us.user_id
                where rc.chat_id = :chatId
            `
            const [members] = await sequelize.query(membersSQL, {
                replacements: {
                    chatId: chatId
                }
            })
            const messages = await ChatMessagesModel.findAll({
                where: {
                    chat_id: chatId
                }
            })
            return {
                chatId,
                chatMembers: members.map(member => ({
                    userId: member.user_id,
                    userImageId: member.imageId,
                    username: member.username,
                    status: member.status
                })),
                messages: messages.map(message => ({
                    messageId: message.id,
                    type: message.type,
                    senderUserId: message.source_user_id,
                    value: message.value,
                    sendDate: message.dispatch_date,
                    fileName: message.file_name,
                    size: message.file_size

                })),
                type: 'room'
            }
        })
    }

    async getCommonChatInfo(chatId) {
        return await sequelize.transaction(async () => {
            const membersSQL = `
                    select us.user_id, us.username, us."imageId", us.status
                    from common_chat_members cm
                             join user_settings us on cm.user_id = us.user_id
                    where cm.chat_id = :chatId
                `
            const [members] = await sequelize.query(membersSQL, {
                replacements: {
                    chatId
                }
            })
            console.log(members)
            const messages = await PersonalMessagesModel.findAll({
                where: {
                    chat_id: chatId
                }
            })
            return {
                chatId,
                chatMembers: members.map(member => ({
                    userId: member.user_id,
                    userImageId: member.imageId,
                    username: member.username,
                    status: member.status
                })),
                messages: messages.map(message => ({
                    messageId: message.id,
                    type: message.type,
                    senderUserId: message.source_user_id,
                    value: message.value,
                    sendDate: message.dispatch_date,
                    fileName: message.file_name,
                    size: message.file_size

                })),
                type: 'common'
            }
        })
    }
}

module.exports = new ChatService()