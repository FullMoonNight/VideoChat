const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const ChatMessagesModel = sequelize.define('chat_messages', {
    id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    text_path: {type: DataTypes.STRING, notNull: true},
    message_type: {type: DataTypes.STRING, notNull: true},
    dispatch_date: {type: DataTypes.DATE, notNull: true}
})

module.exports = ChatMessagesModel