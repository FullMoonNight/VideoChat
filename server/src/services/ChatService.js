const sequelize = require('../database')
const {RoomChatModel} = require("../models");

class ChatService {
    async deleteChat(roomId) {
        return await sequelize.transaction(async () => {
            const chat = await RoomChatModel.findOne({
                where: {
                    room_id: roomId
                }
            })
            if (!chat) return console.log(`room ${roomId} don't have chat`)
            await chat.destroy()
        })
    }
}

module.exports = new ChatService()