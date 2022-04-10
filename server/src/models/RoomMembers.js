const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const RoomMembers = sequelize.define('room_members', {
    relation_id: {type: DataTypes.UUID, primaryKey: true, unique: true},
})

module.exports = RoomMembers