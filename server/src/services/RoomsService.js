const sequelize = require('../database')
const {RoomModel, RoomChatModel, UserModel, RoomMembers} = require("../models");
const {v4} = require("uuid");
const SocketInterface = require('../socket/SocketInterface')
const {generateImage} = require("../utils/GenerateImageFunction");
const fs = require("fs/promises");
const path = require("path");


class RoomsService {
    async getUserRooms(userId) {
        return await sequelize.transaction(async () => {
            const roomsSQL = `
                select r.room_name, r.chat_enable, r.text_editor_enable, r.handwritten_editor_enable, r.owner, r.room_id, r."imageId", rm.confirm
                from room_members rm join rooms r on rm.room_id = r.room_id
                where rm.user_id = :userId;
            `
            const [userRooms] = await sequelize.query(roomsSQL, {
                replacements: {
                    userId
                }
            })
            const roomMembersSQL = `
                select us.user_id, us.username, us."imageId", us.status
                from room_members rm join user_settings us on rm.user_id = us.user_id
                                     join rooms r on rm.room_id = r.room_id
                where rm.room_id = :roomId
                and r.owner <> rm.user_id
            `

            let roomsWithMembers = []
            if (userRooms instanceof Array) {
                for (const room of userRooms) {
                    const [roomMembers] = await sequelize.query(roomMembersSQL, {
                        replacements: {
                            roomId: room.room_id
                        }
                    })

                    roomsWithMembers.push({
                        roomId: room.room_id,
                        name: room.room_name,
                        owner: room.owner,
                        chat: room.chat_enable,
                        editors: {
                            text: room.text_editor_enable,
                            handWr: room.handwritten_editor_enable
                        },
                        roomImageId: room.imageId,
                        confirm: room.confirm,
                        roomMembers
                    })
                }
            }
            return roomsWithMembers
        })
    }

    async createNewRoom(userId, roomName, usersArr, handWrEditor, textEditor, enableChat = true) {
        return await sequelize.transaction(async () => {
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
                new SocketInterface().emitTo(userId, 'ADDED_NEW_ROOM', {roomId: room.room_id})
            }
            // создание изображения комнаты
            const buffer = generateImage(roomName)
            const dirPath = path.join(__dirname, '..', 'static', 'room-image')
            try {
                await fs.access(dirPath)
            } catch (e) {
                console.log('directory not exist')
                await fs.mkdir(dirPath)
            }
            await fs.writeFile(`${dirPath}/${room.room_id}--${room.imageId}.png`, buffer)

            return {roomId: room.room_id, roomName: room.room_name}
        })
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

    async removeUserFromRoom(userId, roomId) {

    }
}

module.exports = new RoomsService()