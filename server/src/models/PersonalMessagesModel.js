const sequelize = require('../database')
const {DataTypes} = require("sequelize");

const PersonalMessagesModel = sequelize.define('personal_messages', {
    id: {type: DataTypes.UUID, primaryKey: true, notNull: true},
    value: {type: DataTypes.STRING, notNull: true},
    message_type: {type: DataTypes.STRING, notNull: true},
    dispatch_date: {type: DataTypes.DATE, notNull: true},
    file_name: {type: DataTypes.STRING},
    file_size: {type: DataTypes.INTEGER}
    //source_user_id - ссылка на отправителя
    //chat_id - ссылка на чат
})

module.exports = PersonalMessagesModel