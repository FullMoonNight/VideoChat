const sequelize = require('../database')
const {RoomModel, RoomChatModel, UserModel, RoomMembers} = require("../models");
const {v4} = require("uuid");
const SocketInterface = require('../socket/SocketInterface')
const {generateImage} = require("../utils/GenerateImageFunction");
const fs = require("fs/promises");
const path = require("path");
const {Op} = require("sequelize");
const ChatService = require('../services/ChatService')


class RoomsService {
    async getUserRooms(userId) {
        return await sequelize.transaction(async () => {
            const userRooms = await RoomMembers.findAll({
                where: {
                    user_id: userId
                }
            })

            let roomsWithMembers = []
            if (userRooms instanceof Array) {
                for (const room of userRooms) {
                    roomsWithMembers.push(await this.getRoomInfo(userId, room.room_id))
                }
            }
            return roomsWithMembers
        })
    }

    async getRoomInfo(userId, roomId) {
        return await sequelize.transaction(async () => {
            const room = await RoomModel.findOne({
                where: {
                    room_id: roomId
                }
            })
            const {confirm} = await RoomMembers.findOne({
                where: {
                    room_id: roomId,
                    user_id: userId
                }
            })
            const roomMembersSQL = `
                select us.user_id, us.username, us."imageId", us.status
                from room_members rm join user_settings us on rm.user_id = us.user_id
                                     join rooms r on rm.room_id = r.room_id
                where rm.room_id = :roomId
            `

            const [roomMembers] = await sequelize.query(roomMembersSQL, {
                replacements: {
                    roomId: room.room_id,
                    currUserId: userId
                }
            })

            let chat = {}
            if (room.chat_enable) {
                chat = await RoomChatModel.findOne({
                    where: {
                        room_id: room.room_id
                    }
                })
            }

            return {
                roomId: room.room_id,
                name: room.room_name,
                owner: room.owner,
                chat: chat.chat_id,
                editors: {
                    text: room.text_editor_enable,
                    handWr: room.handwritten_editor_enable
                },
                roomImageId: room.imageId,
                confirm,
                roomMembers: roomMembers.map(user => ({
                    userId: user.user_id,
                    userImageId: user.imageId,
                    username: user.username,
                    status: user.status
                }))
            }
        })
    }

    async createNewRoom(userId, roomName, usersArr, handWrEditor, textEditor, enableChat) {
        const result = await sequelize.transaction(async () => {
            if (!roomName) throw new Error('Room name isn\'t pass')
            if (!userId) throw new Error('Owner isn\'t specified')
            const user = await UserModel.findOne({where: {user_id: userId}})
            if (!user) throw new Error('User-creator doesn\'t exist')

            const room = await RoomModel.create({
                room_id: v4(),
                room_name: roomName,
                owner: userId,
                chat_enable: enableChat,
                text_editor_enable: textEditor,
                handwritten_editor_enable: handWrEditor,
                imageId: v4(),
            })
            await RoomMembers.create({
                relation_id: v4(),
                user_id: room.owner,
                room_id: room.room_id,
                confirm: true
            })

            if (enableChat) {
                await RoomChatModel.create({
                    chat_id: v4(),
                    room_id: room.room_id
                })
            }

            for (const userId of usersArr) {
                await this.addUserToRoom(userId, room.room_id)
            }
            // создание изображения комнаты
            const buffer = generateImage(roomName)
            const dirPath = path.join(__dirname, '..', 'static', 'room-image')
            try {
                await fs.access(dirPath)
            } catch (e) {
                console.log('directory was created')
                await fs.mkdir(dirPath)
            }
            await fs.writeFile(`${dirPath}/${room.room_id}--${room.imageId}.png`, buffer)

            return {roomId: room.room_id, roomName: room.room_name}
        })

        for (const userId of usersArr) {
            new SocketInterface().emitTo(userId, 'ADDED_NEW_ROOM', {roomId: result.roomId})
        }

        return result
    }

    async addUserToRoom(userId, roomId) {
        const user = await UserModel.findOne({where: {user_id: userId}})
        if (!user) throw new Error('Included user doesn\'t exist')
        //todo убрать 2 нижние строки, потом сделать получение всех пользователей в комнате и проверки на вхождение уже кодом в методе добавления нескольких пользователей
        const roomMember = await RoomMembers.findOne({where: {user_id: userId, room_id: roomId}})
        if (roomMember) return console.log(`User ${userId} already in room ${roomId}`)

        await RoomMembers.create({
            relation_id: v4(),
            user_id: userId,
            room_id: roomId,
            confirm: false
        })
    }

    async confirmJoin(userId, roomId) {
        const roomMember = await RoomMembers.findOne({
            where: {
                room_id: roomId,
                user_id: userId
            }
        })
        if (!roomMember) throw new Error(`user ${userId} id not a member of room ${roomId}`)
        roomMember.confirm = true
        await roomMember.save()
    }

    async removeUserFromRoom(userId, roomId) {
        const roomUsers = await sequelize.transaction(async () => {
            const member = await RoomMembers.findOne({
                where: {
                    user_id: userId,
                    room_id: roomId
                }
            })
            if (!member) return console.log(`user ${userId} not a member of the room ${roomId}`)
            const room = await RoomModel.findOne({
                where: {
                    room_id: roomId
                }
            })
            const otherUsers = await RoomMembers.findAll({
                where: {
                    room_id: roomId,
                    [Op.not]: {
                        user_id: userId
                    }
                }
            })
            if (room.owner === userId && otherUsers.length) {
                throw new Error('Owner of the room cant leave, while other users inside')
            } else {
                await member.destroy()
            }
            const roomMembers = await RoomMembers.findAll({
                where: {
                    room_id: roomId
                }
            })

            if (!roomMembers.length) {
                // await room.destroy()
                await this.deleteRoom(room.room_id)
            }

            return roomMembers
        })
        roomUsers.forEach(user => new SocketInterface().emitTo(user.user_id, 'UPDATE_ROOM_DATA', {roomId}))
    }

    async deleteRoom(roomId) {
        const deletedRoom = await RoomModel.findOne({
            where: {
                room_id: roomId
            }
        });
        if (!deletedRoom) return console.log(`room ${roomId} is not exist`)
        const dirPath = path.join(__dirname, '..', 'static', 'room-image')
        try {
            await fs.access(`${dirPath}/${deletedRoom.room_id}--${deletedRoom.imageId}.png`)
            await fs.rm(`${dirPath}/${deletedRoom.room_id}--${deletedRoom.imageId}.png`)
        } catch (e) {
            console.log(e.message)
        }
        await deletedRoom.destroy()
    }
}

module.exports = new RoomsService()