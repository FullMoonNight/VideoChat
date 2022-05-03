const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const ChatMessagesModel = sequelize.define('chat_messages', {
    id: {type: DataTypes.UUID, primaryKey: true, unique: true},
    value: {type: DataTypes.STRING, notNull: true},
    message_type: {type: DataTypes.STRING, notNull: true},
    dispatch_date: {type: DataTypes.DATE, notNull: true},
    file_name: {type: DataTypes.STRING},
    file_size: {type: DataTypes.INTEGER}
    //user_id - отправитель сообщения
    //chat_id - сслыка на чат, в котором находится сообщение
})

module.exports = ChatMessagesModel