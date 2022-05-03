const sequielize = require('../database')
const {DataTypes} = require("sequelize");


const RoomModel = sequielize.define('room', {
    room_id: {type: DataTypes.UUID, primaryKey: true},
    room_name: {type: DataTypes.STRING, notNull: true},
    imageId: {type: DataTypes.UUID, notNull: true},
    chat_enable: {type: DataTypes.BOOLEAN, notNull: true},
    text_editor_enable: {type: DataTypes.BOOLEAN, notNull: true},
    handwritten_editor_enable: {type: DataTypes.BOOLEAN, notNull: true},
    //owner - создатель комнаты
})

module.exports = RoomModel