const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const RoomMembers = sequelize.define('room_members', {
    relation_id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    confirm: {type: DataTypes.BOOLEAN, notNull: true}
    //user_id - пользователь(участник) комнаты
    //room_id - ссылка на комнату
})

module.exports = RoomMembers