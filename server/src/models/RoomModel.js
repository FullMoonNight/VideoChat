const sequielize = require('../database')
const {DataTypes} = require("sequelize");


const RoomModel = sequielize.define('room', {
    room_id: {type: DataTypes.UUID, primaryKey: true},
    chat_enable: {type: DataTypes.BOOLEAN, notNull: true},
    code_editor_enable: {type: DataTypes.BOOLEAN, notNull: true},
    handwritten_editor_enable: {type: DataTypes.BOOLEAN, notNull: true},
})

module.exports = RoomModel