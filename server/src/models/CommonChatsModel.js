const sequelize = require('../database')
const {DataTypes} = require("sequelize");


const CommonChatsModel = sequelize.define('common_chats', {
    id: {type: DataTypes.UUID, primaryKey: true, unique: true},
})

module.exports = CommonChatsModel