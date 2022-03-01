const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const RoomChatModel = sequelize.define('room_chat', {
    chat_id: {type: DataTypes.UUID, primaryKey: true, unique: true},
})

module.exports = RoomChatModel