const sequelize = require('../database')
const {DataTypes} = require("sequelize");


const CommonChatMembersModel = sequelize.define('common_chat_members', {
    id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    //chat_id - ссылка на чат
    //user_id - ссылка на польователя(участника)
})

module.exports = CommonChatMembersModel