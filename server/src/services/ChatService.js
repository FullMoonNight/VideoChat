const sequelize = require('../database')
const {CommonChatsModel, CommonChatMembersModel, PersonalMessagesModel, ChatMessagesModel, RoomMembers} = require("../models");
const {v4} = require("uuid");
const SocketInterface = require('../socket/SocketInterface')
const path = require("path");
const fs = require('fs/promises')
const {Op} = require("sequelize");


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
                },
                order: [
                    ['dispatch_date', 'ASC']
                ]
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
                    type: message.message_type,
                    senderUserId: message.user_id,
                    value: message.value,
                    sendDate: new Date(message.dispatch_date).toJSON(),
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
            const messages = await PersonalMessagesModel.findAll({
                where: {
                    chat_id: chatId
                },
                order: [
                    ['dispatch_date', 'ASC']
                ]
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
                    type: message.message_type,
                    senderUserId: message.source_user_id,
                    value: message.value,
                    sendDate: new Date(message.dispatch_date).toJSON(),
                    fileName: message.file_name,
                    size: message.file_size

                })),
                type: 'common'
            }
        })
    }

    async sendMessage(data, files) {
        const messages = await sequelize.transaction(async () => {
            if (!(files instanceof Array)) {
                files = files ? [files] : []
            }
            let messages = []
            switch (data.chatType) {
                case "common":
                    messages = await this.saveCommonChatMessage(data, files)
                    break;
                case "room":
                    messages = await this.saveRoomChatMessage(data, files)
                    break;
            }
            return messages
        })
        await this.notifyChatMembers(data, messages.length)
        return messages
    }

    async saveCommonChatMessage(data, files) {
        return await sequelize.transaction(async () => {
            const messages = []
            if (data.message) {
                const textMessage = await PersonalMessagesModel.create({
                    id: v4(),
                    value: data.message,
                    message_type: 'text',
                    dispatch_date: new Date(data.dispatchDate),
                    source_user_id: data.userId,
                    chat_id: data.chatId
                })
                messages.push({
                    messageId: textMessage.id,
                    type: 'text',
                    senderUserId: data.userId,
                    value: data.message,
                    sendDate: data.dispatchDate
                })
            }
            const basePath = path.resolve(__dirname, '..', 'static', 'common_chats_attachments')
            for (let file of files) {
                const fileMessage = await PersonalMessagesModel.create({
                    id: v4(),
                    message_type: 'file',
                    dispatch_date: new Date(data.dispatchDate),
                    file_name: file.name,
                    file_size: file.size,
                    source_user_id: data.userId,
                    chat_id: data.chatId
                })
                try {
                    await fs.access(path.resolve(basePath, fileMessage.chat_id))
                } catch (e) {
                    await fs.mkdir(path.resolve(basePath, fileMessage.chat_id), {recursive: true})
                }
                await fs.writeFile(`${path.resolve(basePath, fileMessage.chat_id)}/${fileMessage.id}${path.parse(file.name).ext}`, file.data)

                messages.push({
                    messageId: fileMessage.id,
                    type: 'file',
                    senderUserId: data.userId,
                    sendDate: data.dispatchDate,
                    fileName: file.name,
                    size: file.size
                })
            }
            return messages
        })
    }

    async saveRoomChatMessage(data, files) {
        return await sequelize.transaction(async () => {
            const messages = []
            if (data.message) {
                const textMessage = await ChatMessagesModel.create({
                    id: v4(),
                    value: data.message,
                    message_type: 'text',
                    dispatch_date: new Date(data.dispatchDate),
                    user_id: data.userId,
                    chat_id: data.chatId
                })
                messages.push({
                    messageId: textMessage.id,
                    type: 'text',
                    senderUserId: data.userId,
                    value: data.message,
                    sendDate: data.dispatchDate
                });
            }
            const basePath = path.resolve(__dirname, '..', 'static', 'room_chats_attachments');
            for (let file of files) {
                const fileMessage = await ChatMessagesModel.create({
                    id: v4(),
                    message_type: 'file',
                    dispatch_date: new Date(data.dispatchDate),
                    file_name: file.name,
                    file_size: file.size,
                    user_id: data.userId,
                    chat_id: data.chatId
                })
                try {
                    await fs.access(path.resolve(basePath, fileMessage.chat_id))
                } catch (e) {
                    await fs.mkdir(path.resolve(basePath, fileMessage.chat_id), {recursive: true})
                }
                await fs.writeFile(`${path.resolve(basePath, fileMessage.chat_id)}/${fileMessage.id}${path.parse(file.name).ext}`, file.data)

                messages.push({
                    messageId: fileMessage.id,
                    type: 'file',
                    senderUserId: data.userId,
                    sendDate: data.dispatchDate,
                    fileName: file.name,
                    size: file.size
                })
            }
            return messages
        })
    }

    async notifyChatMembers(data, messageCount) {
        let chatMembers = []
        let membersSQL = ''
        switch (data.chatType) {
            case "common":
                membersSQL = `
                    select cm.user_id
                    from common_chat_members cm
                    where cm.chat_id = :chatId
                          and cm.user_id <> :userId
                `;
                [chatMembers] = await sequelize.query(membersSQL, {
                    replacements: {
                        chatId: data.chatId,
                        userId: data.userId,
                    }
                })
                break
            case 'room':
                membersSQL = `
                select rm.user_id
                from room_chats rc
                         join rooms r on rc.room_id = r.room_id
                         join room_members rm on r.room_id = rm.room_id
                where rc.chat_id = :chatId
                      and rm.user_id <> :userId
            `;
                [chatMembers] = await sequelize.query(membersSQL, {
                    replacements: {
                        chatId: data.chatId,
                        userId: data.userId
                    }
                })
        }
        chatMembers.forEach(member => new SocketInterface().emitTo(member.user_id, 'UPDATE_CHAT_MESSAGES', {messageCount, chatId: data.chatId, chatType: data.chatType}))
    }

    async getMessages(chatId, chatType, messageCount) {
        return sequelize.transaction(async () => {
            let dbMessages = []
            switch (chatType) {
                case 'common':
                    dbMessages = await PersonalMessagesModel.findAll({
                        where: {
                            chat_id: chatId
                        },
                        limit: messageCount,
                        order: [
                            ['dispatch_date', 'DESC']
                        ]
                    })
                    break
                case 'room':
                    dbMessages = await ChatMessagesModel.findAll({
                        where: {
                            chat_id: chatId
                        },
                        limit: messageCount,
                        order: [
                            ['dispatch_date', 'DESC']
                        ]
                    })
                    break;
            }

            return dbMessages.map(message => ({
                messageId: message.id,
                type: message.message_type,
                senderUserId: message.user_id || message.source_user_id,
                value: message.value,
                sendDate: new Date(message.dispatch_date).toJSON(),
                fileName: message.file_name,
                size: message.file_size,
            }))
        })
    }

    async getStream(chatId, messageId, chatType) {
        let folder, fileName = '', file
        switch (chatType) {
            case 'common':
                folder = 'common_chats_attachments';
                file = await PersonalMessagesModel.findOne({
                    where: {
                        id: messageId
                    }
                })
                fileName = file.file_name
                break;
            case 'room':
                folder = 'room_chats_attachments'
                file = await ChatMessagesModel.findOne({
                    where: {
                        id: messageId
                    }
                })
                fileName = file.file_name
                break;
        }
        const fileBuffer = await fs.readFile(path.resolve(__dirname, '..', 'static', folder, chatId, `${messageId}${path.parse(fileName).ext}`))
        const filePath = path.resolve(__dirname, '..', 'static', folder, chatId, `${messageId}${path.parse(fileName).ext}`)
        return {fileBuffer, fileName, filePath}
    }
}

module.exports = new ChatService()